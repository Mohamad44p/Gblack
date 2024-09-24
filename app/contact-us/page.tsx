import { Suspense } from 'react'
import Loading from '../loading'
import ContactUsContent from '@/components/contact-us/ContactUsContent'


export default function ContactUsPage() {
    return (
        <Suspense fallback={<Loading />}>
            <ContactUsContent />
        </Suspense>
    )
}