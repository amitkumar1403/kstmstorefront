import { useState, FC, useEffect } from 'react'
import { BTN_SUBSCRIBE, GENERAL_EMAIL_ADDRESS, } from '@components/utils/textVariables'

type Props = {} | any

const NewsletterForm: FC<Props> = ({ submitSubscription, isMessage }) => {
    const [ values, setValues ] = useState({
        email: '',
        name: '',
        notifyByEmail: true,
    })

    useEffect(() => {
        if (isMessage) {
            setValues({
                email: '',
                name: '',
                notifyByEmail: true,
            })
        }
    }, [isMessage])

    const handleChange = (e: any) => {
        setValues(v => ({
            ...v,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        submitSubscription(values)
    }

    return (
        <form onSubmit={handleSubmit} autoComplete="off">
            <div className="w-full mt-4 newsletter-form">
                <div className="flex justify-between">
                    <input
                        id="email"
                        type="email"
                        required
                        onChange={handleChange}
                        name={'email'}
                        placeholder="Email Address"
                        value={values.email}
                        className="h-16 sm:h-10 md:h-12 form-control block w-1/2 px-3 py-1.5 text-sm transition border-1 border-gray-400 hover:border-gray-700 ease-in-out m-0 focus:border-blue-600 focus:outline-none"
                    />
                    <label htmlFor="firstname" className="sr-only">
                        {GENERAL_EMAIL_ADDRESS}
                    </label>
                    <input
                        id="name"
                        name={'name'}
                        type="text"
                        required
                        onChange={handleChange}
                        value={values.name}
                        placeholder="Name"
                        className="h-16 sm:h-10 md:h-12 form-control block w-1/2 px-3 py-1.5 text-sm transition border-1 border-gray-400 hover:border-gray-700 ease-in-out m-0 focus:border-blue-600 focus:outline-none"
                    />
                </div>
                <div className="w-full">
                    <button
                        type="submit"
                        className="w-full h-16 sm:h-10 md:h-12 form-control block w-1/2 px-3 py-1.5 text-sm transition border-1 border-gray-400 hover:border-gray-700 ease-in-out m-0 focus:border-blue-600 focus:outline-none capitalize"
                    >
                        {BTN_SUBSCRIBE.toLowerCase()}
                    </button>
                </div>
                {isMessage &&
                    <span className='block w-full p-1 mt-2 text-xs text-gray-800'>
                        Newsletter subscribed successfully!
                    </span>
                }
            </div>
        </form>        
    )
}

export default NewsletterForm