import withAuth from '@components/utils/withAuth'
import { StarIcon } from '@heroicons/react/solid'
import classNames from '@components/utils/classNames'
import { useState } from 'react'
import { 
  BTN_SUBMIT, 
  ERROR_WOOPS_SOMETHING_WENT_WRONG, 
  GENERAL_REVIEW_OUT_OF_FIVE, 
  MESSAGE_CHARACTERS_LEFT, 
  MIN_BODY_LENGTH_ERROR, 
  POST_YOUR_REVIEW, 
  REVIEW_COMMENT, REVIEW_TITLE 
} from '@components/utils/textVariables'

import { NEXT_CREATE_REVIEW } from '@components/utils/constants'
import axios from 'axios'
import { useUI } from '@components/ui/context'

const MIN_LENGTH = 5
const MAX_LENGTH = 240 //@TODO TBD with PO

const TITLE_MIN_LENGTH = 2
const TITLE_MAX_LENGTH = 20

interface ReviewInputProps {
  productId: string
}

const ReviewInput = ({ productId }: ReviewInputProps) => {
  const [rating, setRating] = useState(5)
  const [commentBody, setCommentBody] = useState('')
  const [error, setError] = useState('')
  const [commentTitle, setCommentTitle] = useState('')
  const [asyncMessage, setAsyncMessage] = useState('')

  const { user } = useUI()

  const handleCommentChange = (e: any) => {
    if (e.target.value.length <= MAX_LENGTH) {
      setCommentBody(e.target.value)
    }
  }

  const handleRatingChange = (value: number) => setRating(value)

  const handleSubmit = () => {
    if (!error && commentBody.length < MIN_LENGTH) {
      setError(MIN_BODY_LENGTH_ERROR)
    }
    if (error && commentBody.length >= MIN_LENGTH) {
      setError('')
    }
    const createAsyncReview = async () => {
      try {
        const response: any = await axios.post(NEXT_CREATE_REVIEW, {
          title: commentTitle,
          rating: rating,
          comment: commentBody,
          userId: user.userId,
          userEmail: user.email,
          nickname: user.nickname,
          productId,
        })
        setCommentBody('')
        setCommentTitle('')
        setRating(1)
        setAsyncMessage(response.data.message)
      } catch (error) {
        setAsyncMessage(ERROR_WOOPS_SOMETHING_WENT_WRONG)
      }
    }
    createAsyncReview()
  }

  const handleCommentTitle = (e: any) => {
    if (e.target.value.length <= TITLE_MAX_LENGTH) {
      setCommentTitle(e.target.value)
    }
  }

  return (
    <div className="pt-5 pb-16">
      <h2 className="text-lg font-medium text-gray-900">{POST_YOUR_REVIEW}</h2>
      {asyncMessage ? (
        <div>
          <span className="text-gray-900 text-2xl">{asyncMessage}</span>
        </div>
      ) : (
        <>
          <input
            placeholder={REVIEW_TITLE}
            onChange={handleCommentTitle}
            value={commentTitle}
            className="sm:w-1/3 w-full mb-2 mt-2 mb-5 appearance-none min-w-0 bg-white border border-gray-300 rounded-sm shadow-sm py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 "
          />
          <textarea
            className="text-gray-900 bg-gray-50 rounded-sm border border-gray-400 leading-normal w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
            placeholder={REVIEW_COMMENT}
            value={commentBody}
            onChange={handleCommentChange}
            required
          />
          <span className="text-gray-900 text-sm float-right">
            {MESSAGE_CHARACTERS_LEFT}: {MAX_LENGTH - commentBody.length}
          </span>
          {!!error && <span className="text-red-900 text-sm">{error}</span>}
          <div className="flex flex-center mt-5">
            {[1, 2, 3, 4, 5].map((num) => (
              <StarIcon
                key={`starIcon-${num}`}
                className={classNames(
                  rating >= num ? 'text-yellow-400' : 'text-gray-200',
                  'h-5 w-5 flex-shrink-0'
                )}
                onClick={() => handleRatingChange(num)}
                aria-hidden="true"
              />
            ))}
            <p className="ml-3 text-sm text-gray-700">
              {rating}
              <span className="sr-only"> {GENERAL_REVIEW_OUT_OF_FIVE}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="max-w-xs float-right flex-1 bg-black border border-transparent rounded-sm uppercase py-2 px-4 flex items-center justify-center font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-black sm:w-full"
          >
            {BTN_SUBMIT}
          </button>
        </>
      )}
    </div>
  )
}

export default withAuth(ReviewInput, false)
