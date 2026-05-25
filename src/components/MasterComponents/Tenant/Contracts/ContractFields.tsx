import React, { useEffect, useRef, useState } from 'react';
import FormGroup from '../../../bootstrap/forms/FormGroup';
import ReactSelectComponent from '../../../CustomComponent/Select/ReactSelectComponent';
import StartDateAndEndDateField from '../../../CustomComponent/StartDateAndEndDate';
import useToasterNotification from '../../../../hooks/useToasterNotification';
import { authAxios } from '../../../../axiosInstance';

const ContractFields = ({ register, errors, control, getValues, setValue, watch, isEdit = false }: any) => {

  const { showErrorNotification } = useToasterNotification();
  const [options, setOptions] = useState([]);
  const [buildingList, setBuildinglist] = useState([]);
  const [floorList, setFloorlist] = useState([]);
  const Building = watch('building')
  const Floor = watch('floor')
  const isFirstMount = useRef(true);


  useEffect(() => {
    const url = `api/building_list`;
    authAxios
      .get(url)
      .then((res) => {
        const temp = res.data.map((item: any) => ({
          label: item?.name,
          value: item?.id,
          ...item
        }))
        setBuildinglist(temp)
      })
      .catch((err) => {
        showErrorNotification(err)
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const onchangeOfBuilding = () => {
  //    setValue('floor', '')
  //   if (Building?.id) {
  //     const floorOptions = Array.from(
  //       { length: Building?.highest_floor - Building?.lowest_floor + 1 },
  //       (_, index) => {
  //         const floorNumber = Building?.lowest_floor + index;
  //         return {
  //           label: `Floor ${floorNumber}`,
  //           value: floorNumber,
  //         };
  //       }
  //     );

  //     setFloorlist(floorOptions);
  //   }

  // }
  // const onchangeOfFloor = () => {
  //   if (!Building?.id&&Floor) {
  //   const url = `api/business_spaces_simple?floor=${Floor}&building=${Building?.id}`;
  //   authAxios
  //     .get(url)
  //     .then((res) => {
  //       const temp = res.data.map((item: any) => ({
  //         label: item?.preferred_name,
  //         value: item?.space_id,
  //         ...item
  //       }))
  //       setOptions(temp)
  //     })
  //     .catch((err) => {
  //       showErrorNotification(err)
  //     });
  //   }
  // }

  useEffect(() => {
    if (Building?.id) {
      const floorOptions = Array.from(
        { length: Building.highest_floor - Building.lowest_floor + 1 },
        (_, index) => {
          const floorNumber = Building.lowest_floor + index;
          let label = '';
          if (floorNumber < 0) {
            // Negative floors: Basement 1, Basement 2, etc.
            label = `Basement ${Math.abs(floorNumber)}`;
          } else if (floorNumber === 0) {
            // Floor 0: Ground floor
            label = 'Ground floor';
          } else {
            // Positive floors: Floor 1, Floor 2, etc.
            label = `Floor ${floorNumber}`;
          }
          return {
            label,
            value: floorNumber,
          };
        }
      );
      setFloorlist(floorOptions);
      if (!(isEdit && isFirstMount.current)) {
        setValue('floor', '');
      }
    } else {
      setFloorlist([]);
      setValue('floor', ''); // also reset floor if no building
    }

    isFirstMount.current = false;

  }, [Building]); // runs when Building changes

  useEffect(() => {
    console.log(Floor)
    if (Building?.id && Floor) {
      const url = `api/business_spaces_simple?floor=${Floor.value}&building=${Building.id}`;
      authAxios
        .get(url)
        .then((res) => {
          const temp = res.data.map((item: any) => ({
            label: item?.preferred_name,
            value: item?.space_id,
            ...item,
          }));
          setOptions(temp);
        })
        .catch((err) => {
          showErrorNotification(err);
        });
    } else {
      setOptions([]);
    }
  }, [Building, Floor]); // runs when Floor or Building changes


  return (
    <>

      <div className='col-12'>
        <ReactSelectComponent
          control={control}
          name='Building '
          isMulti={false}
          field_name='building'
          getValues={getValues}
          errors={errors}
          options={buildingList}
        // isRequired
        />
      </div>
      <div className='col-12'>
        <ReactSelectComponent
          control={control}
          name='Floor '
          isMulti={false}
          field_name='floor'
          getValues={getValues}
          errors={errors}
          options={floorList}
        // isRequired
        />
      </div>
      {/* 
      <div className="col-12">
        <FormGroup label="Floor *">
          <input
            type="number"
            className="form-control"
            {...register('floor', { required: true })}
            min="0"
          />
          {errors?.floor?.type === 'required' ? (
            <span style={{ color: 'red' }}>*This field is required</span>
          ) : (
            <p />
          )}
        </FormGroup>
      </div> */}
      <div className='col-12'>
        <ReactSelectComponent
          control={control}
          name='Space '
          isMulti={false}
          field_name='business_space_id'
          getValues={getValues}
          errors={errors}
          options={options}
        // isRequired
        />
      </div>
      {
        !isEdit && <StartDateAndEndDateField
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
          startDate="valid_from"
          endDate="valid_to"
          startDateLabel="Valid from"
          endDateLabel="Valid to"
          is_StartDateRequired
          is_EndDateRequired
          isDisable={false}
        />
      }


      <div className="col-12">
        <FormGroup label="Area *">
          <input
            type="text"
            className="form-control"
            {...register('area', { required: true })}
          />
          {errors?.area?.type === 'required' ? (
            <span style={{ color: 'red' }}>*This field is required</span>
          ) : (
            <p />
          )}
        </FormGroup>
      </div>



      <div className="col-12">
        <FormGroup label="Slots *">
          <input
            type='text'
            className='form-control'
            {...register("slot_count", {
              required: true,

            })}
            onWheel={(e: any) => e.target.blur()}
            onKeyDown={(evt) => {
              const invalidKeys = ['e', 'E', '=', '.'];
              if (invalidKeys.includes(evt.key) || evt.key === 'ArrowDown') {
                evt.preventDefault();
              }
            }}
            onInput={(e: any) => {
              const input = e.target
              input.value = input.value.replace(/[^0-9()+]/g, '');
            }}
          />
          {errors?.slot_count?.type === "required" ? (
            <span style={{ color: 'red' }}>*This field is required</span>
          ) : <p />}
        </FormGroup>
      </div>
    </>
  );
};

export default ContractFields;
