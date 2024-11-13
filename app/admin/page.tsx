'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label'

export default function AdminPurgeCachePage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [authError, setAuthError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
        const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
        if (email === adminEmail && password === adminPassword) {
            setIsAuthenticated(true)
            setAuthError('')
        } else {
            setAuthError('Invalid email or password')
        }
    }

    const handleLogout = () => {
        setIsAuthenticated(false)
        setEmail('')
        setPassword('')
    }

    const handlePurgeCache = async () => {
        setIsLoading(true)
        setMessage('')

        try {
            const response = await fetch(`/api/purge-cache?secret=${process.env.NEXT_PUBLIC_REVALIDATION_SECRET}`, {
                method: 'POST',
            })

            const data = await response.json()

            if (response.ok) {
                setMessage('Cache purged successfully!')
            } else {
                setMessage(`Error: ${data.message}`)
            }
        } catch (error) {
            setMessage('An error occurred while purging the cache.')
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="container h-[100vh] flex items-center justify-center mx-auto py-10">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>{isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}</CardTitle>
                    <CardDescription>
                        {isAuthenticated
                            ? 'Manage your cache purging operations here.'
                            : 'Please login to access admin features.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!isAuthenticated ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" variant="outline" className="w-full bg-black text-white">
                                Login
                            </Button>
                            {authError && <p className="text-red-500 text-center">{authError}</p>}
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <Button
                                onClick={handlePurgeCache}
                                disabled={isLoading}
                                className="w-full"
                                variant="outline"
                            >
                                {isLoading ? 'Purging...' : 'Purge Cache'}
                            </Button>
                            <Button
                                onClick={handleLogout}
                                className="w-full"
                                variant="secondary"
                            >
                                Logout
                            </Button>
                            {message && (
                                <p className={`mt-4 text-center ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                                    {message}
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}