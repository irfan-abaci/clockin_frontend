import React, { useContext, useState } from 'react';
import { Calendar } from 'react-date-range';
import dayjs from 'dayjs';
import Button from '../../bootstrap/Button';
import ThemeContext from '../../../contexts/themeContext';
import Popovers from '../../bootstrap/customPopoverForDateRange';

interface DatePickerProps {
  onFilter: (date: {
    selection: {
      startDate: Date;
      endDate: Date;
      key: string;
      endDateFilter: string;
      startDateFilter: string;
    };
  } | null) => void;
  selectedDate: {
    selection: {
      startDate: Date;
      endDate: Date;
      key: string;
      endDateFilter: string;
      startDateFilter: string;
    };
  };
}

const DatePicker: React.FC<DatePickerProps> = ({
  onFilter,
  selectedDate,
}) => {
  const [date, setDate] = useState<{
    selection: {
      startDate: Date;
      endDate: Date;
      key: string;
      endDateFilter: string;
      startDateFilter: string;
    };
  } | null>(null);

  const { mobileDesign } = useContext(ThemeContext);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleFilter = () => {
    onFilter(date);
    setPopoverOpen(false);
  };

  const handleClear = () => {
    if (selectedDate) {
      onFilter(null);
    }
    setDate(null);
    setPopoverOpen(false);
  };

  const selectedDay = date?.selection?.startDate || dayjs().toDate();
  const maxDate = dayjs().add(3, 'month').toDate();

  const calendarPicker = (
    <div className="d-flex flex-column">
      <Calendar
        date={selectedDay}
        onChange={(selectedDate: Date) => {
          setDate({
            selection: {
              startDate: selectedDate,
              endDate: selectedDate,
              key: 'selection',
              startDateFilter: dayjs(selectedDate).format('YYYY-MM-DD'),
              endDateFilter: dayjs(selectedDate).format('YYYY-MM-DD'),
            },
          });
        }}
        maxDate={maxDate}
        color={String(import.meta.env.VITE_API_SECONDARY_COLOR)}
      />
      {/* <div
        className="d-flex justify-content-end gap-2"
        style={{
          marginBottom: '5px',
          marginRight: '8px',
          marginTop: '-10px',
        }}
      >
        <Button
          size="sm"
          color="danger"
          onClick={handleClear}
          isDisable={!date}
        >
          Clear
        </Button>
        <Button
          size="sm"
          color="secondary"
          onClick={handleFilter}
          isDisable={!date}
        >
          Filter
        </Button>
      </div> */}
    </div>
  );

  return (
    <Popovers
      placement="right-start"
      popoverOpen={popoverOpen}
      setPopoverOpen={setPopoverOpen}
      className="mw-100 overflow-hidden"
      data-tour="date-range-menu"
      bodyClassName="p-0"
      trigger="click"
      desc={calendarPicker}
    >
      <Button color="secondary" isLight icon="DateRange" size="sm">
        {selectedDate
          ? dayjs(selectedDate.selection.startDate).format('YYYY/MM/DD')
          : 'Select Date'}
      </Button>
    </Popovers>
  );
};

export default DatePicker;
