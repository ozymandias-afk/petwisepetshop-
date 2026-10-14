import { NextRequest, NextResponse } from 'next/server'
export function middleware(request: NextRequest) {
 const url=request.nextUrl.clone()
 const parts=url.pathname.split('/')
 const locale=parts[1]
 if(locale!=='ar'&&locale!=='en')return NextResponse.next()
 const nextPath='/'+parts.slice(2).join('/')
 url.pathname=nextPath==='/'?'/' : nextPath
 request.cookies.set('petwise-lang',locale)
 const response=NextResponse.rewrite(url,{request})
 response.cookies.set('petwise-lang',locale,{path:'/',maxAge:31536000,sameSite:'lax'})
 return response
}
export const config={matcher:['/ar','/ar/:path*','/en','/en/:path*']}
