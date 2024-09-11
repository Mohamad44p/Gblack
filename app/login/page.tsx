'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
    const [usernameOrEmail, setUsernameOrEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)
        try {
            const user = await login(usernameOrEmail, password)
            console.log('Login successful:', user);
            router.push('/') // Redirect to home page or dashboard
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'An error occurred during login')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-image Font-GTWalsheim">
            <div className="flex-[2] p-12 flex flex-col justify-center">
                <h1 className="text-[#f9dcc5] text-[7rem] font-bold leading-tight mb-4">
                    <span className="font-saolice text-4xl mx-4">Login</span><br />
                    WELCOME
                    BACK
                </h1>
                <p className="text-[#f3e9d9] text-lg max-w-md">
                    Sign back in to your account to access your courses and embody the art of being human.
                </p>
            </div>
            <div className="flex-1 bg-[#f3e9d9] mx-5 my-3 p-12 flex flex-col justify-center">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <h1 className="text-[#404628] text-[2rem] font-bold leading-tight mb-4">
                        Your Account
                    </h1>
                    <div>
                        <label htmlFor="usernameOrEmail" className="block text-[#404628] text-xl font-extrabold mb-2">
                            USERNAME OR EMAIL
                        </label>
                        <Input
                            id="usernameOrEmail"
                            type="text"
                            className="w-full bg-transparent border-[#404628] border-opacity-50 text-[#3c4a2f]"
                            value={usernameOrEmail}
                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-[#404628] text-xl font-extrabold mb-2">
                            PASSWORD
                        </label>
                        <Input
                            id="password"
                            type="password"
                            className="w-full bg-transparent border-[#404628] border-opacity-50 text-[#404628]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        className="max-w-6xl bg-[#c2b280] hover:bg-[#a89a6b] text-[#404628] text-2xl font-medium py-2 px-4"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'LOG IN'}
                    </Button>
                    {error && <p className="text-red-500">{error}</p>}
                </form>
            </div>
        </div>
    )
}