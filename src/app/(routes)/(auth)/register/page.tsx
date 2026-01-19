'use client';

import Link from 'next/link';
import AuthLayout from '@/app/components/layouts/authLayout';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import LogoGoogle from '@/app/components/icons/LogoGoogle';
import { emailSchema } from '@/app/schemas/auth.schema';
import PasswordRequirements from '@/app/components/ui/PasswordRequirements';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHandleFlowRegister } from '@/app/hooks/auth/useHandleFlowRegister';

export default function RegisterPage() {

  const { email, password, confirmPassword, loading, errors, isEmailExpanded, handleSubmit, handleGoogleRegister, handleEmailChange, handlePasswordChange, handleConfirmPasswordChange, setIsEmailExpanded } = useHandleFlowRegister();

  return (
    <AuthLayout title="Crear cuenta" subtitle="Únete a MaxShop hoy mismo">
      <div className="flex flex-col h-full justify-between w-full">
        <div className="flex flex-col gap-6 flex-1 justify-center">

        {/* 1. Primary CTA: Google Register */}
        <motion.div
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full px-1"
        >
          <Button
            type="button"
            variant="white-primary"
            size="lg"
            fullWidth
            onClick={handleGoogleRegister}
            disabled={loading}
            className="relative group h-14 sm:h-16 text-base sm:text-lg shadow-sm border border-gray-200 hover:border-orange-200 hover:bg-orange-50/50 transition-all duration-300"
          >
            <div className="absolute left-4 sm:left-6 flex items-center justify-center bg-white p-1 rounded-full shadow-sm">
              <LogoGoogle />
            </div>
            <span className="text-gray-700 font-semibold group-hover:text-orange-700 transition-colors pl-8">
              Registrarse con Google
            </span>
          </Button>
        </motion.div>

        {/* Separator */}
        <div className="relative flex items-center gap-4 py-4 opacity-60 flex-shrink-0">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">o</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* 2. Secondary Option: Email Register */}
        <AnimatePresence mode="wait">
          {!isEmailExpanded ? (
            <motion.button
              key="expand-btn-reg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              onClick={() => setIsEmailExpanded(true)}
              className="w-full py-4 flex items-center justify-between px-6 rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-md hover:bg-white bg-gray-50/50 transition-all duration-300 group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                  <Mail size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">Registrarse con email</span>
                  <span className="text-xs text-gray-500">Crea una cuenta con tu correo</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 group-hover:text-orange-500 transition-colors">
                <ArrowRight size={16} />
              </div>
            </motion.button>
          ) : (
            <motion.form
              key="email-form-reg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-5 p-1">
                <Input
                  id="email"
                  type="email"
                  label="Tu email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="tu@email.com"
                  required
                  disabled={loading}
                  error={errors.email}
                  schema={emailSchema}
                  icon={Mail}
                />

                <div>
                  <Input
                    id="password"
                    type="password"
                    label="Crear contraseña"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    error={errors.password}
                    icon={Lock}
                  />
                  <div className="mt-2">
                    <PasswordRequirements password={password} />
                  </div>
                </div>

                <Input
                  id="confirmPassword"
                  type="password"
                  label="Confirmar contraseña"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  error={errors.confirmPassword}
                  icon={Lock}
                />
              </div>

              <div className="pt-5 flex flex-col gap-4 px-1">
                <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading} className="h-12 shadow-lg shadow-orange-500/20">
                  {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                </Button>

                <button
                  type="button"
                  onClick={() => setIsEmailExpanded(false)}
                  className="text-sm text-gray-400 hover:text-gray-600 font-medium py-2 text-center transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        </div>

        {/* Footer Links */}
        <div className="text-center flex-shrink-0 py-6">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-all">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
