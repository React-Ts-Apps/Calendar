import { WorkDayCalendar } from './utils/WorkDayCalendar'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [result, setResult] = useState<string>("")
  const [holiday, setHoliday] = useState<Date | null>(null)
  const [recurringHoliday, setRecurringHoliday] = useState<Date | null>(null)
  const [holidays, setHolidays] = useState<Date[]>([])
  const [recurringHolidays, setRecurringHolidays] = useState<Date[]>([])

  const [startDateTime, setStartDateTime] = useState<Date | null>(new Date());
  const [workStartTime, setWorkStartTime] = useState<Date | null>(new Date());
  const [workEndTime, setWorkEndTime] = useState<Date | null>(new Date());
  const [incrementInput, setIncrementInput] = useState<string>("-5.5");
  const [increment, setIncrement] = useState<number>(-5.5);


  const addHoliday = () => {
    if (holiday) {
      setHolidays([...holidays, holiday])
      setHoliday(null)
    }
  }

  const addRecurringHoliday = () => {
    if (recurringHoliday) {
      setRecurringHolidays([...recurringHolidays, recurringHoliday])
      setRecurringHoliday(null)
    }
  }

  const calculate = () => {
    if (!startDateTime || !workStartTime || !workEndTime) {
      alert("Please select all required dates and times.");
      return;
    }
    const calendar = new WorkDayCalendar()
    calendar.setWorkDaystartAndStop(workStartTime, workEndTime)
    holidays.forEach((d) => calendar.setHolidays(d))
    recurringHolidays.forEach((d) => calendar.setRecurringHolidays(d))


    const resultDate = calendar.getWorkDayIncrement(startDateTime, increment)

    setResult(resultDate.toLocaleString())
  }

  const handleBlur = () => {
    const parsed = parseFloat(incrementInput);
    if (!isNaN(parsed)) {
      setIncrement(parsed);
    }
  }

  return (
    <div className='p-4 space-y-4 max-w-xl mx-auto bg-white shadow rounded'>
      <h2 className="text-xl font-semibold">Workday Calculator</h2>
      <div className='space-y-2'>
        <label className='block'>Add Specific Holiday (yyyy-mm-dd)</label>
        <div className="flex gap-2 items-center">
          <DatePicker selected={holiday} onChange={(date) => setHoliday(date)}
            dateFormat='yyyy-MM-dd'
            dropdownMode='select'
            showMonthDropdown
            showYearDropdown
            className="border px-2 py-1 rounded" />
          <button onClick={addHoliday} className="bg-blue-600 text-white px-3 py-1 rounded">
            Add
          </button>
        </div>
        <ul className='text-sm text-gray-800'>
          {holidays.map((d, i) => (
            <li key={i}>{d.toDateString()}</li>
          ))}
        </ul>
      </div>

      <div className='space-y-2'>
        <label className='block'>Add Recurring Holiday (mm-dd)</label>
        <div className="flex gap-2 items-center">
          <DatePicker selected={recurringHoliday} onChange={(date) => setRecurringHoliday(date)}
            dateFormat='MM-dd'
            showMonthDropdown
            dropdownMode='select'
            className="border px-2 py-1 rounded" />
          <button onClick={addRecurringHoliday} className="bg-blue-600 text-white px-3 py-1 rounded">
            Add
          </button>
        </div>
        <ul className='text-sm text-gray-800'>
          {recurringHolidays.map((d, i) => (
            <li key={i}>{d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</li>
          ))}
        </ul>
      </div>

      <div>
        <label className='block'>Start Date & Time:</label>
        <DatePicker
          selected={startDateTime}
          onChange={(date) => setStartDateTime(date)}
          dropdownMode='select'
          showMonthDropdown
          showYearDropdown
          dateFormat="Pp"
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      <div>
        <label className='block'>Workday Start Time:</label>
        <DatePicker
          selected={workStartTime}
          onChange={(date) => setWorkStartTime(date)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Start Time"
          dateFormat="HH:mm"
          className="border px-2 py-1 rounded w-full"
        />
      </div>
      <div>
        <label className='block'>Workday End Time:</label>
        <DatePicker
          selected={workEndTime}
          onChange={(date) => setWorkEndTime(date)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="End Time"
          dateFormat="HH:mm"
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      <div>
        <label className='block'>Workday Increment (can be negative):</label>
        <input
          type="text"
          value={incrementInput}
          onChange={(e) => setIncrementInput(e.target.value)}
          onBlur={handleBlur}
          className="border px-2 py-1 rounded w-full"
          placeholder="e.g. -2.5"
        />
      </div>


      <button onClick={calculate} className="mt-4 bg-purple-600 text-white px-4 py-2 rounded">
        Calculate Workday Increment
      </button>

      {result && (
        <p className="mt-4 text-lg">
          Resulting date: <strong>{result}</strong>
        </p>
      )}
    </div>
  )
}

export default App
