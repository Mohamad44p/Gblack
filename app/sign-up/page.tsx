/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

export default function SignUpPage() {
    return (
        <div className="flex min-h-screen bg-image Font-GTWalsheim">
            <div className="flex-[2] p-12 flex flex-col justify-center">
                <h1 className="text-[#f9dcc5] text-[8rem] font-bold leading-tight mb-4">
                    CREATE
                    <span className="font-saolice text-4xl mx-4">an</span><br />
                    ACCOUNT
                </h1>
                <p className="text-[#f3e9d9] text-lg max-w-md">
                    Create an account in order to purchase Domi's courses and access exclusive content.
                </p>
            </div>
            <div className="flex-[1] bg-[#f3e9d9] mx-5 my-3 p-12 flex flex-col justify-center">
                <form className="space-y-6 ">
                    <div>
                        <label htmlFor="email" className="block text-[#404628] text-xl font-extrabold mb-2">
                            EMAIL
                        </label>
                        <Input
                            id="email"
                            type="email"
                            className="w-full bg-transparent border-[#404628] border-opacity-50 text-[#404628]"
                        />
                    </div>
                    <div>
                        <label htmlFor="fullName" className="block text-[#404628] text-xl font-extrabold mb-2">
                            FULL NAME
                        </label>
                        <Input
                            id="fullName"
                            type="text"
                            className="w-full bg-transparent border-[#404628] border-opacity-50 text-[#404628]"
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
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="marketing" className="border-[#404628] border-opacity-50" />
                            <label htmlFor="marketing" className="text-sm text-[#404628]">
                                I consent to receive marketing emails
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="terms" className="border-[#404628] border-opacity-50" />
                            <label htmlFor="terms" className="text-sm text-[#404628]">
                                I agree to the{" "}
                                <Link href="/privacy-policy" className="text-[#ff0000] underline">
                                    Privacy Policy
                                </Link>{" "}
                                and{" "}
                                <Link href="/terms" className="text-[#ff0000] underline">
                                    Terms & Conditions
                                </Link>
                            </label>
                        </div>
                    </div>
                    <Button className="w-full bg-[#c2b280] hover:bg-[#a89a6b] text-[#404628] font-medium py-2 px-4">
                        CREATE ACCOUNT
                    </Button>
                    <div className='border-t border-black' />
                    <div className='flex items-center justify-between'>
                        <Link href="/sign-in" className="text-[#404628] text-xl">
                            Already have an account?
                        </Link>
                        <Link href="/login" className="text-[#404628] text-xl underline underline-offset-8">
                            Login &#8599;
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}