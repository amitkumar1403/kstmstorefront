import { useState } from 'react'
import { CheckCircleIcon } from '@heroicons/react/solid'
import Button from '@components/ui/IndigoButton'
import {
  GENERAL_DISTANCE_MILES,
  GENERAL_ADDRESS,
  NORMAL_OPENING_HOURS
} from '@components/utils/textVariables'

const hardcodedOpeningHours = [
  {
    day: 'Monday',
    hours: '09:00 - 18:00',
  },
  {
    day: 'Tuesday',
    hours: '09:00 - 18:00',
  },
  {
    day: 'Wednesday',
    hours: '09:00 - 18:00',
  },
  {
    day: 'Thursday',
    hours: '09:00 - 18:00',
  },
  {
    day: 'Friday',
    hours: '09:00 - 18:00',
  },
  {
    day: 'Saturday',
    hours: '09:00 - 18:00',
  },
  {
    day: 'Sunday',
    hours: '09:00 - 18:00',
  },
]
export default function CncList({
  availableLocations,
  setSelectedStore,
  submitShippingMethod,
}: any) {
  const [selectedLocation, setSelectedLocation] = useState({
    id: '',
    postCode: '',
    storeId: '',
  })

  const handleStore = async () => {
    setSelectedStore(selectedLocation)
    await submitShippingMethod(selectedLocation.storeId)
  }

  return (
    <ul className="text-gray-900 ml-7">
      {availableLocations?.map((location: any, idx: number) => {
        return (
          <div
            key={idx}
            className={
              selectedLocation.id === location.id
                ? 'border-indigo-600 border border-t '
                : 'border-t border'
            }
          >
            <li
              onClick={() => setSelectedLocation(location)}
              className={`pointer py-5 px-5 flex justify-between flex-row`}
            >
              <div>
                <h3 className="font-bold">{location.name}</h3>
                <p className="text-sm font-semibold py-2">
                  {location.availableToCollectIn}
                </p>
                <p className="text-sm py-2">
                  {location.distanceInMetres} {GENERAL_DISTANCE_MILES}
                </p>
              </div>
              <div className="flex flex-row justify-center items-center">
                {selectedLocation.id === location.id ? (
                  <div className="ml-5">
                    <CheckCircleIcon
                      className="h-5 w-5 text-indigo-600"
                      aria-hidden="true"
                    />
                  </div>
                ) : null}
              </div>
            </li>
            {selectedLocation.id === location.id ? (
              <div className="px-5 py-2 flex flex-col">
                <div className="py-2">
                  <h4 className="font-bold">{GENERAL_ADDRESS}</h4>
                  <span>{selectedLocation.postCode}</span>
                </div>
                <div className="py-2">
                  <Button
                    title="Collect from this store"
                    action={handleStore}
                  />
                </div>
                <div className="py-2">
                  <h4 className="font-bold">{NORMAL_OPENING_HOURS}</h4>
                  <div>
                    {hardcodedOpeningHours.map((datetime: any, idx: number) => (
                      <div
                        key={idx}
                        className="py-1 text-gray-900 flex justify-between items-center"
                      >
                        <span>{datetime.day}</span>
                        <span>{datetime.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )
      })}
    </ul>
  )
}
