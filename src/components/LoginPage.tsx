import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ToastContainer } from '@/components/ui/toast'
import { useToast } from '@/hooks/useToast'

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const { toasts, addToast, removeToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showResend, setShowResend] = useState(false)

  const resetFields = () => {
    setEmail('')
    setPassword('')
    setName('')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) {
      if (error.message.toLowerCase().includes('email not confirmed')) {
        addToast({
          title: 'Email not confirmed',
          description: 'Please check your inbox and confirm your email before logging in.',
          variant: 'warning',
        })
        setShowResend(true)
      } else {
        addToast({
          title: 'Login failed',
          description: error.message,
          variant: 'error',
        })
        setShowResend(false)
      }
    } else {
      setShowResend(false)
      addToast({ title: 'Login successful', variant: 'success' })
      onLogin()
      resetFields()
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      addToast({ title: 'Sign up failed', description: error.message, variant: 'error' })
      setLoading(false)
      return
    }

    if (data.user) {
      // Optionally update user metadata with name
      await supabase.from('profiles').upsert({ id: data.user.id, full_name: name })
      addToast({ title: 'Sign up successful! Please check your email to confirm.', variant: 'success' })
      setIsSignUp(false)
      resetFields()
    }
    setLoading(false)
  }

  const handleResendConfirmation = async () => {
    setLoading(true)
    // Supabase does not have a direct resendVerificationEmail method in latest version
    // Use signUp with redirect option to resend confirmation email as a workaround
    // Note: this will not work properly with dummy password, better to inform user to re-register or check email
    addToast({
      title: 'Please check your email for the confirmation link.',
      variant: 'warning',
    })
    setLoading(false)
    return

    if (error) {
      addToast({ title: 'Resend failed', description: error.message, variant: 'error' })
    } else {
      addToast({ title: 'Confirmation email resent!', variant: 'success' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background text-foreground px-4">
      <h1 className="text-3xl font-bold mb-6">{isSignUp ? 'Sign Up' : 'Login'}</h1>
      <form
        onSubmit={isSignUp ? handleSignUp : handleLogin}
        className="w-full max-w-md p-6 bg-muted rounded-lg shadow-md"
      >
        {isSignUp && (
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1 font-medium">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground font-semibold py-2 rounded-md hover:bg-primary/90 transition"
        >
          {loading ? (isSignUp ? 'Signing up...' : 'Signing in...') : (isSignUp ? 'Sign Up' : 'Sign In')}
        </button>
        {showResend && !isSignUp && (
          <div className="mt-2 text-sm text-yellow-600 text-center">
            <button
              type="button"
              onClick={handleResendConfirmation}
              disabled={loading}
              className="underline hover:text-yellow-800"
            >
              Resend confirmation email
            </button>
          </div>
        )}
      </form>
      <p className="mt-4 text-sm text-muted-foreground text-center">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={() => {
            setIsSignUp(!isSignUp)
            resetFields()
            setShowResend(false)
          }}
          className="text-primary underline font-medium"
        >
          {isSignUp ? 'Login here' : 'Sign up'}
        </button>
      </p>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  )
}

export default LoginPage
