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
