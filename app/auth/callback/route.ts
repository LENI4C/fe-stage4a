import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Get the correct origin for redirect
      const forwardedHost = request.headers.get('x-forwarded-host')
      const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
      const forwardedPort = request.headers.get('x-forwarded-port')
      
      // Use environment variable if set (for production)
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
      
      let redirectUrl: string
      
      if (siteUrl) {
        // Use explicit site URL from environment
        redirectUrl = `${siteUrl}${next}`
      } else if (forwardedHost) {
        // Use forwarded headers (Vercel, Netlify, etc.)
        const protocol = forwardedProto === 'https' ? 'https' : 'http'
        const port = forwardedPort && forwardedPort !== '80' && forwardedPort !== '443' ? `:${forwardedPort}` : ''
        redirectUrl = `${protocol}://${forwardedHost}${port}${next}`
      } else {
        // Fallback to request URL origin
        const url = new URL(request.url)
        redirectUrl = `${url.origin}${next}`
      }
      
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Get error redirect URL using same logic
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  let errorUrl: string
  
  if (siteUrl) {
    errorUrl = `${siteUrl}/auth/auth-code-error`
  } else if (forwardedHost) {
    const protocol = forwardedProto === 'https' ? 'https' : 'http'
    errorUrl = `${protocol}://${forwardedHost}/auth/auth-code-error`
  } else {
    const url = new URL(request.url)
    errorUrl = `${url.origin}/auth/auth-code-error`
  }

  return NextResponse.redirect(errorUrl)
}

