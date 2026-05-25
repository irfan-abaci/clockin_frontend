import React, { useState, useEffect } from 'react';
import Button from '../../bootstrap/Button';
import Popovers from '../../bootstrap/customPopoverForDateRange';
import Label from '../../bootstrap/forms/Label';
import formatTime from '../../../helpers/formatTime';

interface TimeRangeFilterProps {
  onFilter: (time: { selection: { startTime?: string | null; endTime?: string | null; startDateFilter?: string; endDateFilter?: string; } } | null) => void;
  selectedDate?: { selection: { startDateFilter?: string; endDateFilter?: string; startTime?: string | null; endTime?: string | null; } };
}

const TimeRangeFilter: React.FC<TimeRangeFilterProps> = ({ onFilter, selectedDate }) => {
  const [time, setTime] = useState<{ selection: { startTime: string; endTime: string; startDateFilter?: string; endDateFilter?: string; } } | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Initialize time from selectedDate if available. Never populate date when only time is selected.
  useEffect(() => {
    const hasDateRange = selectedDate?.selection?.startDateFilter && selectedDate?.selection?.endDateFilter;
    if (selectedDate?.selection?.startTime || selectedDate?.selection?.endTime) {
      const selectedStartTime = selectedDate.selection.startTime;
      const selectedEndTime = selectedDate.selection.endTime;
      const currentStartTime = time?.selection?.startTime;
      const currentEndTime = time?.selection?.endTime;

      if (!time || (selectedStartTime && selectedStartTime !== currentStartTime) || (selectedEndTime && selectedEndTime !== currentEndTime)) {
        setTime({
          selection: {
            startTime: selectedStartTime || currentStartTime || '00:00',
            endTime: selectedEndTime || currentEndTime || '23:59',
            ...(hasDateRange && {
              startDateFilter: selectedDate.selection.startDateFilter,
              endDateFilter: selectedDate.selection.endDateFilter,
            }),
          },
        });
      }
    } else if (selectedDate && hasDateRange && !selectedDate.selection?.startTime && !selectedDate.selection?.endTime) {
      // Only sync date filters when selectedDate has a date range and no time
      if (time) {
        setTime({
          selection: {
            ...time.selection,
            startDateFilter: selectedDate.selection.startDateFilter,
            endDateFilter: selectedDate.selection.endDateFilter,
          },
        });
      }
    }
  }, [selectedDate]);

  const handleFilter = () => {
    if (time) {
      const hasDateRange = selectedDate?.selection?.startDateFilter && selectedDate?.selection?.endDateFilter;
      // When no date is selected, send only time (no date params). When date is selected, merge time with date.
      const mergedData = hasDateRange
        ? {
            selection: {
              ...selectedDate.selection,
              startTime: time.selection.startTime,
              endTime: time.selection.endTime,
            },
          }
        : {
            selection: {
              startTime: time.selection.startTime,
              endTime: time.selection.endTime,
            },
          };
      onFilter(mergedData);
    }
    setPopoverOpen(false);
  };

  const handleClear = () => {
    setTime(null);
    setPopoverOpen(false);
    // Clear only time; keep date if it was selected (same pattern as DateRangeFilter clear)
    const hasDateRange = selectedDate?.selection?.startDateFilter && selectedDate?.selection?.endDateFilter;
    if (hasDateRange && selectedDate?.selection) {
      // Pass explicit null for time so parent does not preserve previous time
      onFilter({
        selection: {
          startDateFilter: selectedDate.selection.startDateFilter,
          endDateFilter: selectedDate.selection.endDateFilter,
          startTime: null,
          endTime: null,
        },
      });
    } else {
      onFilter(null);
    }
  };

  const handleTimeChange = (type: 'startTime' | 'endTime', value: string) => {
    const hasDateRange = selectedDate?.selection?.startDateFilter && selectedDate?.selection?.endDateFilter;
    const currentDate = hasDateRange ? selectedDate?.selection?.startDateFilter : undefined;
    const endDate = hasDateRange ? selectedDate?.selection?.endDateFilter : undefined;

    const currentStartTime = time?.selection?.startTime || selectedDate?.selection?.startTime || '00:00';
    const currentEndTime = time?.selection?.endTime || selectedDate?.selection?.endTime || '23:59';

    setTime({
      selection: {
        startTime: type === 'startTime' ? value : currentStartTime,
        endTime: type === 'endTime' ? value : currentEndTime,
        ...(hasDateRange && currentDate && endDate && { startDateFilter: currentDate, endDateFilter: endDate }),
      },
    });
  };

  const timePicker = (
    <div className="d-flex flex-column p-3" style={{ minWidth: '250px' }}>
      <div className="d-flex align-items-center p-2">
        <Label htmlFor="start-time" style={{ width: '120px' }}>
          Start Time:
        </Label>
        <input
          type="time"
          id="start-time"
          className="form-control"
          value={time?.selection?.startTime || selectedDate?.selection?.startTime || '00:00'}
          onChange={(e) => {
            handleTimeChange('startTime', e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace') {
              e.preventDefault();
            }
          }}
        />
      </div>
      <div className="d-flex justify-content-between align-items-center p-2">
        <Label htmlFor="end-time" style={{ width: '120px' }}>
          End Time:
        </Label>
        <input
          type="time"
          id="end-time"
          className="form-control"
          value={time?.selection?.endTime || selectedDate?.selection?.endTime || '23:59'}
          onChange={(e) => {
            handleTimeChange('endTime', e.target.value);
          }}
          min={time?.selection?.startTime || selectedDate?.selection?.startTime || undefined}
          onKeyDown={(e) => {
            if (e.key === 'Backspace') {
              e.preventDefault();
            }
          }}
        />
      </div>
      <div
        className="d-flex justify-content-end gap-2"
        style={{
          marginTop: '10px',
        }}
      >
        <Button size="sm" color="danger" onClick={handleClear} isDisable={!time && !selectedDate?.selection?.startTime}>
          Clear
        </Button>
        <Button size="sm" color="secondary" onClick={handleFilter} isDisable={!time && !selectedDate?.selection?.startTime}>
          Filter
        </Button>
      </div>
    </div>
  );

  const hasTimeFilter = time || selectedDate?.selection?.startTime || selectedDate?.selection?.endTime;

  return (
    <Popovers
      placement="right-start"
      popoverOpen={popoverOpen}
      setPopoverOpen={setPopoverOpen}
      className="mw-100 overflow-hidden"
      data-tour="time-range-menu"
      bodyClassName="p-0"
      trigger="click"
      desc={timePicker}
    >
      <Button color="secondary" isLight icon="Schedule" size="sm" style={{ marginLeft: '8px' }}>
        {hasTimeFilter
          ? `${formatTime(time?.selection?.startTime || selectedDate?.selection?.startTime || '00:00')} - ${formatTime(time?.selection?.endTime || selectedDate?.selection?.endTime || '23:59')}`
          : 'Time Filter'}
      </Button>
    </Popovers>
  );
};

export default TimeRangeFilter;

