import React from 'react'

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
