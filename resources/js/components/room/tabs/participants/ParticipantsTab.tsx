import EmptyParticipantsCard from '@/components/room/tabs/participants/EmptyParticipantsCard'
import { StudentRanking } from '@/components/room/tabs/participants/StudentRanking'
import { Room } from '@/models'
import { useMemo } from 'react'

type ParticipantsTabProps = {
  room: Room
}

export default function ParticipantsTab({ room }: ParticipantsTabProps) {
  const students = useMemo(() => room.students ?? [], [room.students])

  console.log('Students in ParticipantsTab:', students)
  if (students.length === 0) return <EmptyParticipantsCard room={room} />

  return (
    <div className="space-y-2">
      {students.map((participant, index) => (
        <StudentRanking
          key={participant.id}
          student={participant}
          order={index + 1}
        />
      ))}
    </div>
  )
}
