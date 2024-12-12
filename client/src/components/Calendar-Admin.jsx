import React from 'react'
    let selectedDayMeetings = meetings.filter((meeting) =>
        isSameDay(parseISO(meeting.startDatetime), selectedDay)
    )
    function Meeting({ meeting }) {
        let startDateTime = parseISO(meeting.startDatetime)
        let endDateTime = parseISO(meeting.endDatetime)
    
        return (
            <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
                <img
                    src={meeting.imageUrl}
                    alt=""
                    className="flex-none w-10 h-10 rounded-full"
                />
                <div className="flex-auto">
                    <p className="text-gray-900">{meeting.name}</p>
                    <p className="mt-0.5">
                        <time dateTime={meeting.startDatetime}>
                            {format(startDateTime, 'h:mm a')}
                        </time>{' '}
                        -{' '}
                        <time dateTime={meeting.endDatetime}>
                            {format(endDateTime, 'h:mm a')}
                        </time>
                    </p>
                </div>
    
            </li>
        )
    }
    const meetings = [
        {
            id: 1,
            name: 'Leslie Alexander',
            imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            startDatetime: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate() + 1).padStart(2, '0')}T13:00`,
            endDatetime: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate() + 1).padStart(2, '0')}T14:30`,
        },
        {
            id: 2,
            name: 'Michael Foster',
            imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            startDatetime: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}T09:00`,
            endDatetime: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}T11:30`,
        }
    ]
    let colStartClasses = [
        '',
        'col-start-2',
        'col-start-3',
        'col-start-4',
        'col-start-5',
        'col-start-6',
        'col-start-7',
    ]
export default function CalendarAdmin () {
  return (
    <section className="mt-12 md:mt-0 md:pl-14">
                        <h2 className="font-semibold text-gray-900">
                            Sessões para{' '}
                            <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                                {format(selectedDay, 'MMM dd, yyy')}
                            </time>
                        </h2>
                        <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
                            {selectedDayMeetings.length > 0 ? (
                                selectedDayMeetings.map((meeting) => (
                                    <Meeting meeting={meeting} key={meeting.id} />

                                ))
                            ) : (
                                <>
                                    <p >Não existem sessões para hoje.</p>
                                    <Link
                                        className="  block py-2 px-6 bg-[#4f4fb9] text-white rounded-md text-base hover:bg-[#3e3e9e] mt-11 "
                                        to="/"
                                    >
                                        Agendar sessão
                                    </Link>



                                </>

                            )}
                        </ol>
                    </section>
  )
}
