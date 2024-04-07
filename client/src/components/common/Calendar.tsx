import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import { AiOutlineCalendar, AiOutlineArrowRight, AiOutlineArrowLeft } from 'react-icons/ai'
import getMonthsList from "../../utils/getMonthsList";
import {
    add,
    eachDayOfInterval,
    endOfMonth,
    format,
    getDay,
    isEqual,
    isBefore,
    parse,
    startOfToday,
    isSameMonth,
    isSameDay,
    isAfter,
    getYear,
    startOfYear,
    subYears,
    addYears,
    set
} from 'date-fns';

export interface CalendarInterface {
    selectedDay?: null | Date | number;
    setSelectedDay: Function;
    calendarStyle?: Object;
    selectPastDays?: boolean;
    selectPostDays?: boolean;
    containerStyle?: Object;
    datesStyle?: Object;
    label?: string,
    selectYear?: boolean
  }

export default function Calendar({
    selectedDay,
    setSelectedDay,
    calendarStyle,
    selectPastDays,
    selectPostDays,
    containerStyle,
    datesStyle,
    label,
    selectYear,
}: CalendarInterface) {
    const today = startOfToday();
    const [isSelectingYear, setIsSelectingYear] = useState(false)
    const [isSelectingMonth, setIsSelectingMonth] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
    const [currentYear, setCurrentYear] = useState(new Date(`15-${currentMonth}`))
    const [selectedYear, setSelectedYear] = useState(getYear(currentMonth))
    useEffect(() => {
        if (selectedDay) {
            const yearOfSelectedDay = getYear(selectedDay);
            if (yearOfSelectedDay !== getYear(currentYear)) {
                setCurrentYear(new Date(`12-12-${yearOfSelectedDay}`));
            }
        }
    }, [selectedDay]);
    const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', today);
    const days = eachDayOfInterval({
      start: firstDayCurrentMonth,
      end: endOfMonth(firstDayCurrentMonth),
    });

    const firstDayPastMonth = add(firstDayCurrentMonth, { months: -1 });

    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });

    function previousMonth() {
        if (isSelectingYear) {
            const date = new Date(currentYear)
            const newYear = addYears(date, -14)
            setCurrentYear(newYear)
            return
        }
        if (!selectPastDays && isSameMonth(firstDayCurrentMonth, today)) return;
        let firstDayPreviousMonth = add(firstDayCurrentMonth, { months: -1 });
        setCurrentMonth(format(firstDayPreviousMonth, 'MMM-yyyy'))
      }
    function nextMonth() {
        if (isSelectingYear) {
            const date = new Date(currentYear)
            const uptodateYear = getYear(today)
            const newYear = addYears(date, 14)
            const yearsDiff = getYear(newYear) - uptodateYear
            if (yearsDiff > 0) return setCurrentYear(new Date(`12-1-${uptodateYear}`))
            setCurrentYear(newYear)
            return
        }
        let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
    }
    const pastMonthDays = eachDayOfInterval({
      start: firstDayPastMonth,
      end: endOfMonth(firstDayPastMonth),
    });

    const nextMonthDays = eachDayOfInterval({
      start: firstDayNextMonth,
      end: endOfMonth(firstDayNextMonth),
    });

    function handleSelectedDay(day: Date) {
        if (!selectPastDays && isBefore(day, today)) return;
        if (!selectPostDays && isAfter(day, today)) return;
        if (selectedDay && isSameDay(selectedDay, day)) {
            return setSelectedDay(null)
        }
        setSelectedDay(day);
    }
    function handleSelectedYear(year: number) {
        if (selectedDay) {
            const newDate = set(selectedDay, {year: year})
            setSelectedDay(newDate)
            setCurrentMonth(format(newDate, 'MMM-yyyy'))
        } else {
            const newDate = set(firstDayCurrentMonth, {year})
            setCurrentMonth(format(newDate, 'MMM-yyyy'))
        }
        setSelectedYear(year)
        setIsSelectingYear(false)

    } 
    const returningYears = (inputYear: number): number[] => {
        const currentYear = new Date().getFullYear();
        const years = [];
      
        // Ensure the range does not go beyond the current year
        let startYear = inputYear;
        for (let i = 0; i < 7; i++) {
          const futureYear = addYears(startOfYear(new Date(startYear, 0, 1)), i);
          if (futureYear.getFullYear() <= currentYear) {
            years.push(futureYear.getFullYear());
          }
        }
      
        // Add the input year and years before it
        for (let i = 1; i <= 7; i++) {  // Start from 1 to avoid repeating the input year
          const pastYear = subYears(startOfYear(new Date(startYear, 0, 1)), i);
          years.unshift(pastYear.getFullYear());  // Add to the beginning of the array
        }
      
        return years;
      };

    function handleSelectedMonth(month: number) {
      if (selectedDay) {
        const newDate = set(selectedDay, {month})
        setCurrentMonth(format(newDate, 'MMM-yyyy'))
      } else {
        const newDate = set(firstDayCurrentMonth, {month})
        setCurrentMonth(format(newDate, 'MMM-yyyy'))
      }
      setIsSelectingMonth(false)
    }

    const years_range = returningYears(getYear(currentYear))
    return (
        <MainContainer>
            {
                label &&
                <label>{label}</label>
            }
            <Main 
            style={containerStyle}
            >
                <Container>
                  <Header>
                    {
                      !isSelectingMonth &&
                      <button type="button" onClick={previousMonth} className="previous">
                          <AiOutlineArrowLeft/>
                      </button>
                    }
                    <div className="date-display"
                    >
                            <>
                            {
                                isSelectingYear ?
                                <span
                                style={{cursor: 'pointer'}}
                                onClick={() => setIsSelectingYear(!isSelectingYear)}
                                >
                                    {years_range[0]}
                                    -
                                    {years_range[years_range.length - 1]}
                                </span>
                                :
                                  <>
                                  {
                                    isSelectingMonth ?
                                    <span
                                    style={{cursor: 'pointer'}}
                                    onClick={() => setIsSelectingMonth(!isSelectingMonth)}
                                    >
                                      {format(firstDayCurrentMonth, 'MMMM')}
                                    </span>
                                    :
                                    <>
                                    <span
                                    style={{cursor: 'pointer'}}
                                    onClick={() => setIsSelectingMonth(!isSelectingMonth)}
                                    >
                                    {format(firstDayCurrentMonth, 'MMM')}
                                    </span>
                                    <span> </span>
                                    <span
                                    style={{cursor: 'pointer'}}
                                    onClick={() => setIsSelectingYear(!isSelectingYear)}
                                    >
                                    {format(firstDayCurrentMonth, 'yyyy')}
                                    </span>
                                    </>
                                  }
                                  </>
                            }
                            </>
                    </div>
                    {
                      !isSelectingMonth &&
                      <button type="button" onClick={nextMonth} className="next">
                          <AiOutlineArrowRight/>
                      </button>
                    }
                  </Header>
                  <hr />
                  {
                    isSelectingYear 
                    ?
                    <div className="days">
                    {
                        years_range.map((year, idx) => {
                            let className = ''
                            if (year === selectedYear) className = 'selected'
                            return (
                                <div
                                key={idx}
                                className={className}
                              >
                                <button 
                                type="button"
                                onClick={() => handleSelectedYear(year)}
                                style={{width: '40px', height: '40px'}}>
                                  {year}
                                </button>
                              </div>
                                )
                            })
                        }
                    </div>
                    :
                    <>
                      {
                        isSelectingMonth
                        ?
                        <>
                        <div className="days">
                          {
                            getMonthsList().map((month, idx) => {
                              return (
                                <div
                                  className={currentMonth.slice(0,3) === month ? 'selected' : ''}
                                >
                                  <button key={idx}
                                  type="button"
                                  onClick={() => handleSelectedMonth(idx)}
                                  >
                                    <span>{month}</span>
                                  </button>
                                </div>
                              )
                            })
                          }
                        </div>
                        </>
                        :
                        <>
                        <div className="daysweek">
                          <div>Mon</div>
                          <div>Tue</div>
                          <div>Wen</div>
                          <div>Thu</div>
                          <div>Fri</div>
                          <div>Sat</div>
                          <div>Sun</div>
                        </div>
                        <div className="days">
                          {pastMonthDays
                            .slice(
                              getDay(days[0]) !== 0 ? pastMonthDays.length - getDay(days[0]) + 1 : pastMonthDays.length - 6,
                              pastMonthDays.length,
                            )
                            .map((day, dayIdx) => {
                              let className = '';
                              if (selectedDay && isEqual(day, selectedDay)) className = 'selected'
                              return (
                                <div key={dayIdx} className={className}>
                                  <button type="button" onClick={() => handleSelectedDay(day)} className="past">
                                    <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
                                  </button>
                                </div>
                              );
                            })}
                          {days.map((day, dayIdx) => {
                            let className = '';
                            if (selectedDay && isEqual(day, selectedDay)) className = 'selected'
                            return (
                              <div
                                key={dayIdx}
                                style={
                                  dayIdx === 0
                                    ? getDay(day) === 0
                                      ? { gridColumn: '7/8' }
                                      : { gridColumn: `${getDay(day)} / span 1` }
                                    : {}
                                }
                                className={className}
                              >
                                <button type="button" onClick={() => handleSelectedDay(day)} className={!selectPostDays ? (isAfter(day, today) ? 'past' : '') : ''}>
                                  <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
                                </button>
                              </div>
                            );
                          })}
                          {nextMonthDays
                            .slice(0, getDay(days[days.length - 1]) ? 7 - getDay(days[days.length - 1]) : 0)
                            // if day of the week is 0 (sunday), then it will slide from 0 to 0, givin an empty array
                            // from first day 1 to the index of last day of the week within the month, then it substracs 7 to that given value
                            .map((day, dayIdx) => {
                              let className = '';
                              if (selectedDay && isEqual(selectedDay, day)) className = 'selected'
                              return (
                                <div key={dayIdx} className={className}>
                                  <button type="button" onClick={() => handleSelectedDay(day)} className="next">
                                    <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
                                  </button>
                                </div>
                              );
                            })}
                        </div>
                        </>
                      }
                  </>
                  }
                </Container>
            </Main>
    </MainContainer>

    )
}

const MainContainer = styled.div`
display: flex;
align-items: center;
flex-direction: column;
justify-content: center;
align-items: center;
label {
  display: block;
    font-size: 14px;
    margin-bottom: 10px;
    font-weight: 700;
    color: ${props => props.theme.gray.GunmetalGray};
}
`

const Main = styled.div`
    position: relative;
    z-index: 9;
    height: fit-content;
    .calendar {
        &.selected {
            width: auto;
            height: auto;
        }
        > .current-date {
            padding: 5px;
            font-size: 14px;
        }
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid ${props => props.theme.gray.DarkGray};
      border-radius: 5px;
      font-size: 24px;
      cursor: pointer;
    }
  .calendar-wrapper {
    position: absolute;
    background-color: ${props => props.theme.white.White};
    bottom: 0;
    padding: 0;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    right: calc(100% + 5px);
    overflow: hidden;
    padding-bottom: 10px;
    border-radius: 16px;
    display: flex;
    align-items: flex-start;
   
  }
  div.date {
    padding: 10px 20px;
    height: 100%;
    cursor: pointer;
    border-radius: 176px;
    transition: background-color 0.03 ease;
    display: flex;
    align-items: center;
    justify-content: center;
    button {
      background-color: rgba(0, 0, 0, 0);
      border: none;
      margin-left: 10px;
      cursor: pointer;
    }
    :hover {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
  div.date.selecting {
    background-color: ${props => props.theme.white.White};
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
`;

const Container = styled.div`
  background-color: ${props => props.theme.white.White};
  padding: 10px;
  hr {
    margin: 5px 0;
  }
  .daysweek {
    display: grid;
    font-size: 14px;
    text-align: center;
    grid-template-columns: repeat(7, 1fr);
    gap: 10px 0;
  }
  .days {
    width: 300px;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px 0;
    > div {
      margin: 0;
      font-size: 14px;
      font-family: 'Roboto';
      height: 30px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .next,
    .past {
      color: #a9a9a9;
    }
    button {
      width: 30px;
      height: 30px;
      background-color: rgba(0, 0, 0, 0);
      border: none;
      cursor: pointer;
      border-radius: 50%;
      color: #000;
    }
    > div.selected {
      button {
        background: ${(props) => props.theme.blue.Denim};
        color: ${props => props.theme.white.White};
      }
    }
  }
`;

const Header = styled.div`
  padding: 10px 0;
  text-align: center;
  display: flex;
  align-items: center;
  .date-display {
    flex: 1;
  }
  > button {
      top: 20px;
      background-color: rgba(0, 0, 0, 0);
      border: none;
      width: 35px;
      height: 10px;
      cursor: pointer;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
    }
    > button.previous {
      left: 10px;
    }
    > button.next {
      right: 10px;
    }
`;