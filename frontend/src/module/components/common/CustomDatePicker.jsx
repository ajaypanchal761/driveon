import { useState, useRef, useEffect } from "react";
import { colors } from "../../theme/colors";

/**
 * CustomDatePicker Component - Custom date picker with theme colors
 */
const CustomDatePicker = ({
  value,
  onChange,
  placeholder = "Select date & time",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : null
  );

  // Convert 24-hour to 12-hour format for display
  const get12HourFormat = (hour24) => {
    if (hour24 === 0) return { hour: 12, period: "am" };
    if (hour24 < 12) return { hour: hour24, period: "am" };
    if (hour24 === 12) return { hour: 12, period: "pm" };
    return { hour: hour24 - 12, period: "pm" };
  };

  const initialTime = selectedDate
    ? get12HourFormat(selectedDate.getHours())
    : { hour: 10, period: "am" };
  const [selectedHour, setSelectedHour] = useState(initialTime.hour);
  const [selectedMinute, setSelectedMinute] = useState(
    selectedDate ? selectedDate.getMinutes() : 30
  );
  const [selectedPeriod, setSelectedPeriod] = useState(initialTime.period);
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const datePickerRef = useRef(null);
  const timePickerRef = useRef(null);

  useEffect(() => {
    if (value) {
      // Parse date string in local timezone to avoid timezone issues
      let date;
      if (typeof value === "string" && value.includes("T")) {
        // Format: YYYY-MM-DDTHH:mm
        const [datePart, timePart] = value.split("T");
        const [year, month, day] = datePart.split("-").map(Number);
        date = new Date(year, month - 1, day, 12, 0, 0);
        if (timePart) {
          const [hour, minute] = timePart.split(":").map(Number);
          date.setHours(hour || 12);
          date.setMinutes(minute || 0);
        }
      } else {
        date = new Date(value);
      }

      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        const time12 = get12HourFormat(date.getHours());
        setSelectedHour(time12.hour);
        setSelectedMinute(date.getMinutes());
        setSelectedPeriod(time12.period);
        setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
      if (
        timePickerRef.current &&
        !timePickerRef.current.contains(event.target)
      ) {
        setIsTimePickerOpen(false);
      }
    };

    if (isOpen || isTimePickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isTimePickerOpen]);

  const formatDate = (date) => {
    if (!date) return "";
    // Use local date components to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Convert 12-hour to 24-hour format
    let hour24 = selectedHour;
    if (selectedPeriod === "pm" && selectedHour !== 12) {
      hour24 = selectedHour + 12;
    } else if (selectedPeriod === "am" && selectedHour === 12) {
      hour24 = 0;
    }

    const hour = String(hour24).padStart(2, "0");
    const minute = String(selectedMinute).padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:${minute}`;
  };

  const handleDateSelect = (date) => {
    // Create new date at noon to avoid timezone issues, then set time
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const newDate = new Date(year, month, day, 12, 0, 0);

    // Convert 12-hour to 24-hour format
    let hour24 = selectedHour;
    if (selectedPeriod === "pm" && selectedHour !== 12) {
      hour24 = selectedHour + 12;
    } else if (selectedPeriod === "am" && selectedHour === 12) {
      hour24 = 0;
    }
    newDate.setHours(hour24);
    newDate.setMinutes(selectedMinute);
    setSelectedDate(newDate);
    onChange(formatDate(newDate));
  };

  const handleTimeChange = (hour, minute, period) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    if (period) setSelectedPeriod(period);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      // Convert 12-hour to 24-hour format
      let hour24 = hour;
      const finalPeriod = period || selectedPeriod;
      if (finalPeriod === "pm" && hour !== 12) {
        hour24 = hour + 12;
      } else if (finalPeriod === "am" && hour === 12) {
        hour24 = 0;
      }
      newDate.setHours(hour24);
      newDate.setMinutes(minute);
      setSelectedDate(newDate);
      onChange(formatDate(newDate));
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add days of the month - create dates at noon (12:00) to avoid timezone shift issues
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day, 12, 0, 0));
    }
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const displayValue = selectedDate
    ? `${selectedDate.toLocaleDateString()} ${String(selectedHour).padStart(
        2,
        "0"
      )} : ${String(selectedMinute).padStart(2, "0")} ${selectedPeriod}`
    : placeholder;

  return (
    <div ref={datePickerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2.5 py-1.5 rounded-lg border text-xs flex items-center justify-between"
        style={{
          borderColor: colors.borderForm,
          backgroundColor: colors.backgroundSecondary,
          color: colors.textPrimary,
        }}
      >
        <span>{displayValue}</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: colors.textPrimary }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[105] bg-black/30"
            onClick={() => setIsOpen(false)}
          />

          {/* Calendar Popup */}
          <div
            className="fixed z-[110] rounded-lg shadow-2xl border p-3"
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.borderForm,
              width: "280px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {/* Calendar Section */}
            <div className="mb-2">
              {/* Month Header */}
              <div className="flex items-center justify-between mb-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() - 1
                      )
                    )
                  }
                  className="p-0.5 rounded"
                  style={{ color: colors.textPrimary }}
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <span
                  className="text-xs font-semibold"
                  style={{ color: colors.textPrimary }}
                >
                  {monthNames[currentMonth.getMonth()].substring(0, 3)},{" "}
                  {currentMonth.getFullYear()}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1
                      )
                    )
                  }
                  className="p-0.5 rounded"
                  style={{ color: colors.textPrimary }}
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Week Days */}
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-[10px] font-medium"
                    style={{ color: colors.textSecondary }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-0.5">
                {days.map((date, idx) => {
                  if (!date) {
                    return <div key={idx} />;
                  }
                  // Compare dates using local date components to avoid timezone issues
                  const dateYear = date.getFullYear();
                  const dateMonth = date.getMonth();
                  const dateDay = date.getDate();

                  let isSelected = false;
                  if (selectedDate) {
                    const selectedYear = selectedDate.getFullYear();
                    const selectedMonth = selectedDate.getMonth();
                    const selectedDay = selectedDate.getDate();
                    isSelected =
                      dateYear === selectedYear &&
                      dateMonth === selectedMonth &&
                      dateDay === selectedDay;
                  }

                  // Check if today using local date components
                  const today = new Date();
                  const todayYear = today.getFullYear();
                  const todayMonth = today.getMonth();
                  const todayDay = today.getDate();
                  const isToday =
                    dateYear === todayYear &&
                    dateMonth === todayMonth &&
                    dateDay === todayDay;

                  const isCurrentMonth = dateMonth === currentMonth.getMonth();

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleDateSelect(date)}
                      className="w-6 h-6 rounded text-[10px] flex items-center justify-center"
                      style={{
                        backgroundColor: isSelected
                          ? colors.brandBlack
                          : "transparent",
                        color: isSelected
                          ? colors.backgroundSecondary
                          : isCurrentMonth
                          ? colors.textPrimary
                          : colors.textTertiary,
                        border:
                          isToday && !isSelected
                            ? `1px solid ${colors.brandBlack}`
                            : "none",
                      }}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection Button - Like BookNowPage */}
            <div className="mb-2">
              <label
                className="block text-[10px] font-medium mb-1"
                style={{ color: colors.textPrimary }}
              >
                Time
              </label>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTimePickerOpen(true);
                  }}
                  className="w-auto px-3 py-1.5 rounded-lg border-2 flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
                  style={{
                    borderColor: colors.backgroundTertiary,
                    backgroundColor: colors.backgroundTertiary,
                    color: colors.backgroundSecondary,
                  }}
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-semibold text-[10px]">
                    {String(selectedHour).padStart(2, "0")} :{" "}
                    {String(selectedMinute).padStart(2, "0")} {selectedPeriod}
                  </span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className="flex gap-1.5 mt-2 pt-2 border-t"
              style={{ borderColor: colors.borderForm }}
            >
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(null);
                  onChange("");
                  setIsOpen(false);
                }}
                className="flex-1 px-2 py-1 text-[10px] rounded"
                style={{
                  color: colors.brandBlack,
                  backgroundColor: "transparent",
                }}
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  // Create today's date at noon to avoid timezone issues
                  const today = new Date();
                  const todayAtNoon = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate(),
                    12,
                    0,
                    0
                  );
                  handleDateSelect(todayAtNoon);
                  setIsOpen(false);
                }}
                className="flex-1 px-2 py-1 text-[10px] rounded"
                style={{
                  color: colors.brandBlack,
                  backgroundColor: "transparent",
                }}
              >
                Today
              </button>
            </div>
          </div>
        </>
      )}

      {/* Time Picker Popup - Like Calendar Popup */}
      {isTimePickerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[105] bg-black/30"
            onClick={() => setIsTimePickerOpen(false)}
          />

          {/* Time Picker Popup */}
          <div
            ref={timePickerRef}
            className="fixed z-[110] rounded-lg shadow-2xl border p-2"
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.borderForm,
              width: "240px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="text-[10px] font-bold mb-1.5 text-center"
              style={{ color: colors.textPrimary }}
            >
              Select Time
            </h3>

            {/* Time Selection */}
            <div className="flex items-center justify-center gap-2 mb-2">
              {/* Hour Selection */}
              <div className="flex flex-col items-center relative">
                <label
                  className="text-[10px] font-semibold mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  Hour
                </label>
                <div className="relative flex items-center">
                  <div
                    className="flex flex-col gap-0 overflow-y-auto"
                    style={{
                      width: "40px",
                      maxHeight: "96px",
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    <style>{`
                      div[style*="maxHeight: '96px'"]::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                      <button
                        key={hour}
                        type="button"
                        onClick={() =>
                          handleTimeChange(hour, selectedMinute, selectedPeriod)
                        }
                        className={`w-10 h-8 flex items-center justify-center text-[11px] font-semibold transition-all ${
                          selectedHour === hour ? "text-white" : "text-gray-600"
                        }`}
                        style={{
                          backgroundColor:
                            selectedHour === hour
                              ? colors.backgroundTertiary
                              : "transparent",
                        }}
                      >
                        {hour.toString().padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                  {/* Scroll indicator line */}
                  <div
                    className="absolute right-0 w-[2px] bg-gray-200 rounded-full"
                    style={{ height: "96px", top: "0" }}
                  ></div>
                </div>
              </div>

              <span
                className="text-base font-bold mt-8"
                style={{ color: colors.textPrimary }}
              >
                :
              </span>

              {/* Minute Selection */}
              <div className="flex flex-col items-center relative">
                <label
                  className="text-[10px] font-semibold mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  Minute
                </label>
                <div className="relative flex items-center">
                  <div
                    className="flex flex-col gap-0 overflow-y-auto"
                    style={{
                      width: "40px",
                      maxHeight: "96px",
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                      <button
                        key={minute}
                        type="button"
                        onClick={() =>
                          handleTimeChange(selectedHour, minute, selectedPeriod)
                        }
                        className={`w-10 h-8 flex items-center justify-center text-[11px] font-semibold transition-all ${
                          selectedMinute === minute
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                        style={{
                          backgroundColor:
                            selectedMinute === minute
                              ? colors.backgroundTertiary
                              : "transparent",
                        }}
                      >
                        {minute.toString().padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                  {/* Scroll indicator line */}
                  <div
                    className="absolute right-0 w-[2px] bg-gray-200 rounded-full"
                    style={{ height: "96px", top: "0" }}
                  ></div>
                </div>
              </div>

              {/* AM/PM Selection */}
              <div className="flex flex-col items-center">
                <label
                  className="text-[10px] font-semibold mb-1.5"
                  style={{ color: colors.textSecondary }}
                >
                  Period
                </label>
                <div className="flex flex-col gap-1">
                  {["am", "pm"].map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() =>
                        handleTimeChange(selectedHour, selectedMinute, period)
                      }
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                        selectedPeriod === period
                          ? "text-white"
                          : "text-gray-600"
                      }`}
                      style={{
                        backgroundColor:
                          selectedPeriod === period
                            ? colors.backgroundTertiary
                            : "#f3f4f6",
                        color:
                          selectedPeriod === period
                            ? "white"
                            : colors.textPrimary,
                      }}
                    >
                      {period.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Done Button */}
            <button
              type="button"
              onClick={() => setIsTimePickerOpen(false)}
              className="w-full py-1 rounded-lg text-white font-semibold text-[9px]"
              style={{ backgroundColor: colors.backgroundTertiary }}
            >
              Done
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomDatePicker;
