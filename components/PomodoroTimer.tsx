import {
  Box,
  Button,
  ButtonGroup,
  useInterval,
  useStyleConfig,
  Stack,
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  PopoverArrow,
  useMediaQuery,
} from '@chakra-ui/react'
import { ReactElement, useReducer } from 'react'
import { FaGraduationCap } from 'react-icons/fa'
import { IoTimerOutline } from 'react-icons/io5'
import {
  MdPlayArrow,
  MdPause,
  MdReplay,
  MdFastForward,
  MdVideogameAsset,
  MdOutlineCheck,
} from 'react-icons/md'
import { formatTime, minute, second } from '../lib/time'

export interface TimerState {
  status: TimerStatus
  timeRemaining: number
  isRunning: boolean
}

export enum TimerStatus {
  Idle = 'idle',
  Studying = 'studying',
  StudyingPaused = 'studying-paused',
  StudyingComplete = 'studying-complete',
  Break = 'break',
  BreakComplete = 'break-complete',
}

export type TimerEvent =
  | 'break'
  | 'pause'
  | 'reset'
  | 'resume'
  | 'skip'
  | 'study'
  | 'tick'

export interface TimerEventData {
  event: TimerEvent
  eventDesc: string
  eventIcon?: ReactElement
}

const initialState: TimerState = {
  status: TimerStatus.Idle,
  timeRemaining: 25 * minute,
  isRunning: false,
}

const reducer = (state: TimerState, event: TimerEvent): TimerState => {
  switch (event) {
    case 'break':
      return {
        status: TimerStatus.Break,
        timeRemaining: 5 * minute,
        isRunning: true,
      }

    case 'pause':
      return {
        ...state,
        status: TimerStatus.StudyingPaused,
        isRunning: false,
      }

    case 'reset':
      return initialState

    case 'resume':
      return {
        ...state,
        status: TimerStatus.Studying,
        isRunning: true,
      }

    case 'skip':
      return initialState

    case 'study':
      return {
        status: TimerStatus.Studying,
        timeRemaining: 25 * minute,
        isRunning: true,
      }

    case 'tick':
      const remaining = state.timeRemaining - 1 * second
      const timeRemaining = remaining < 0 ? 0 : remaining

      if (timeRemaining !== 0) {
        return {
          ...state,
          timeRemaining,
        }
      }

      return {
        status:
          state.status === TimerStatus.Break
            ? TimerStatus.BreakComplete
            : TimerStatus.StudyingComplete,
        timeRemaining: 0,
        isRunning: false,
      }

    default:
      // throw if event is not handled, helpful for development
      const exhaustiveCheck: never = event
      throw new Error(`Unhandled event: ${exhaustiveCheck}`)
  }
}

const Status = ({ children }: { children?: string }) => (
  <div aria-label="timer status">{children}</div>
)

const TimeRemaining = ({ time }: { time: number }) => (
  <time aria-label="time remaining">{formatTime(time)}</time>
)

export const PomodoroTimer = (props: any) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { isRunning, status, timeRemaining } = state

  const { variant, ...rest } = props
  const [isBigScreen] = useMediaQuery('(min-width: 62em)')
  const maxPopoverWidth = isBigScreen ? '14rem' : '11rem'

  const timerStyle = useStyleConfig('PomodoroTimer', { variant })
  const iconStyle = useStyleConfig('PomodoroIcon', { variant })

  const getButton = (data: TimerEventData, idx: number) => {
    return data.eventIcon ? (
      isBigScreen ? (
        <Button
          key={idx}
          onClick={() => dispatch(data.event)}
          leftIcon={data.eventIcon}
        >
          {data.eventDesc}
        </Button>
      ) : (
        <IconButton
          key={idx}
          onClick={() => dispatch(data.event)}
          icon={data.eventIcon}
          aria-label={data.eventDesc}
        />
      )
    ) : (
      <Button key={idx} onClick={() => dispatch(data.event)}>
        {data.eventDesc}
      </Button>
    )
  }

  const buildPomodoroUI = (
    mainIcon: ReactElement,
    status: string | undefined,
    time: number,
    events: TimerEventData[],
  ) => {
    return (
      <Popover
        trigger="hover"
        placement={isBigScreen ? 'bottom' : 'bottom-end'}
      >
        <PopoverTrigger>
          <Box __css={iconStyle} display="inline-flex">
            <IconButton
              icon={mainIcon}
              variant="pomodoroIcon"
              aria-label="Pomodoro Timer"
            />
          </Box>
        </PopoverTrigger>
        <PopoverContent maxWidth={maxPopoverWidth}>
          <PopoverArrow />
          <Stack direction="column" align="center" __css={timerStyle}>
            {status ? <Status>{status}</Status> : <Status>&nbsp;</Status>}
            <TimeRemaining time={time} />
            <ButtonGroup variant="pomodoroControl" size="sm" gap="0" isAttached>
              {events.map((e, idx) => getButton(e, idx))}
            </ButtonGroup>
          </Stack>
        </PopoverContent>
      </Popover>
    )
  }

  useInterval(() => dispatch('tick'), isRunning ? 1 * second : null)

  switch (status) {
    case TimerStatus.Idle:
      return buildPomodoroUI(<IoTimerOutline />, '', timeRemaining, [
        { event: 'study', eventDesc: 'Study', eventIcon: <FaGraduationCap /> },
      ])

    case TimerStatus.Studying:
      return buildPomodoroUI(<FaGraduationCap />, 'Studying', timeRemaining, [
        { event: 'pause', eventDesc: 'Pause', eventIcon: <MdPause /> },
        {
          event: 'reset',
          eventDesc: 'Reset',
          eventIcon: <MdReplay />,
        },
      ])

    case TimerStatus.StudyingPaused:
      return buildPomodoroUI(<MdPause />, 'Studying Paused', timeRemaining, [
        { event: 'resume', eventDesc: 'Resume', eventIcon: <MdPlayArrow /> },
        {
          event: 'reset',
          eventDesc: 'Reset',
          eventIcon: <MdReplay />,
        },
      ])

    case TimerStatus.StudyingComplete:
      return buildPomodoroUI(<MdOutlineCheck />, 'Studying Complete', 0, [
        { event: 'break', eventDesc: 'Break', eventIcon: <MdVideogameAsset /> },
      ])

    case TimerStatus.Break:
      return buildPomodoroUI(<MdVideogameAsset />, 'On Break', timeRemaining, [
        { event: 'skip', eventDesc: 'Skip', eventIcon: <MdFastForward /> },
      ])

    case TimerStatus.BreakComplete:
      return buildPomodoroUI(
        <IoTimerOutline />,
        'Break Complete',
        timeRemaining,
        [
          {
            event: 'study',
            eventDesc: 'Study',
            eventIcon: <FaGraduationCap />,
          },
        ],
      )

    default:
      // throw if status is not handled, helpful for development
      const exhaustiveCheck: never = status
      throw new Error(`Unhandled status: ${exhaustiveCheck}`)
  }
}
