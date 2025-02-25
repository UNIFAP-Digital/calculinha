import EmptyParticipantsCard from '@/components/room/tabs/participants/EmptyParticipantsCard'
import { ParticipantRanking } from '@/components/room/tabs/participants/ParticipantRanking'
import Room from '@/models/room'
import { useMemo } from 'react'

type ParticipantsTabProps = {
  room: Room
}

export default function ParticipantsTab({ room }: ParticipantsTabProps) {
  const participants = useMemo(() => room.participants!, [room.participants])

  if (participants.length === 0) return <EmptyParticipantsCard room={room} />

  return (
    <div className="space-y-2">
      {participants.map((participant, index) => (
        <ParticipantRanking key={participant.id} participant={participant} position={index + 1} />
      ))}
    </div>
  )
}
