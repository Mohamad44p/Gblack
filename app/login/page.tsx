/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
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
                <form className="space-y-6 ">
                    <h1 className="text-[#404628] text-[2rem] font-bold leading-tight mb-4">
                        Your Account
                    </h1>
                    <div>
                        <label htmlFor="email" className="block text-[#404628] text-xl font-extrabold mb-2">
                            EMAIL
                        </label>
                        <Input
                            id="email"
                            type="email"
                            className="w-full bg-transparent border-[#404628] border-opacity-50 text-[#3c4a2f]"
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
                        />
                    </div>
                    <Button className="max-w-6xl bg-[#c2b280] hover:bg-[#a89a6b] text-[#404628] text-2xl font-medium py-2 px-4">
                        LOG IN
                    </Button>
                    <div className='border-t border-black' />
                    <div className='flex items-center justify-between'>
                        <Link href="/sign-in" className="text-[#404628] text-xl">
                            FORGOTTEN PASSWORD &#8599;
                        </Link>
                        <Link href="/sign-up" className="text-[#404628] text-xl underline underline-offset-8">
                            CREATE AN ACCOUNT &#8599;
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}