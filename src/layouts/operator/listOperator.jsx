import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator, timelineOppositeContentClasses } from "@mui/lab";


export default function ListOperator({ user,choseUser }) {
    return (
        <Timeline
            className="theme-timeline"
            nonce={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
            sx={{
                p: 0,
                mb: '-40px',
                '& .MuiTimelineConnector-root': {
                    width: '1px',
                    backgroundColor: '#efefef'
                },
                [`& .${timelineOppositeContentClasses.root}`]: {
                    flex: 0.5,
                    paddingLeft: 0,
                },
            }}
        >
            <TimelineItem style={{cursor:'pointer'}} onClick={() =>choseUser(user.id)}>
                <TimelineOppositeContent>{user.loginHash}</TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot color={user.deletedAt ? "error" : "success"} variant="outlined" />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>{user.name}</TimelineContent>
            </TimelineItem>
        </Timeline>
    )
}