import React, { useEffect, useState } from 'react';
import BrandAPI from '../../../../API/Brand';
import CategoryAPI from '../../../../API/Category';
import CustomSelect from '../../../../components/CustomSelect';
import '../style.scss';
import { TextField } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { toast } from 'react-toastify';
import ClearIcon from '@mui/icons-material/Clear';

export default function ProductFilter(props) {
  const [categoryOption, setCategoryOption] = useState([]);
  const [brandOption, setBrandOption] = useState([]);
  const [categorySelected, setCategorySelected] = useState(-1);
  const [brandSelected, setBrandSelected] = useState(-1);
  const [filterPrice, setFilterPrice] = useState([undefined, undefined]);

  const getlistCategory = async () => {
    try {
      const branchRes = await CategoryAPI.getAllCategory();
      if (branchRes?.data?.success) {
        const payload = branchRes?.data?.payload;
        const option = payload?.map((item, index) => {
          return {
            label: item?.name,
            value: item?._id,
          };
        });
        option.unshift({
          label: 'Tất cả',
          value: -1,
        });
        setCategoryOption(option);
      }
    } catch (error) {
      console.log('get list brand error >>> ', error);
    }
  };

  const getListBranch = async () => {
    try {
      const branchRes = await BrandAPI.getAllBrand();
      if (branchRes?.data?.success) {
        const payload = branchRes?.data?.payload;
        const option = payload?.map((item, index) => {
          return {
            label: item?.name,
            value: item?._id,
          };
        });
        option.unshift({
          label: 'Tất cả',
          value: -1,
        });
        setBrandOption(option);
      }
    } catch (error) {
      console.log('get list brand error >>> ', error);
    }
  };

  useEffect(() => {
    getlistCategory();
    getListBranch();
  }, []);

  useEffect(() => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    const category_id = params.category_id;
    const brand_id = params.brand_id;
    const min = params.min;
    const max = params.max;

    if (category_id) setCategorySelected(category_id);
    if (brand_id) setBrandSelected(brand_id);
    setFilterPrice([min || undefined, max || undefined]);
  }, []);

  return (
    <div className='product-page-filter'>
      <CustomSelect
        option={categoryOption}
        label='Danh mục'
        value={categorySelected}
        handleChange={(value) => {
          setCategorySelected(value);
          const urlParams = new URLSearchParams(window.location.search);
          urlParams.set('category_id', value);
          window.location.search = urlParams;
        }}
      />
      <CustomSelect
        option={brandOption}
        label='Thương hiệu'
        value={brandSelected}
        handleChange={(value) => {
          setBrandSelected(value);
          const urlParams = new URLSearchParams(window.location.search);
          urlParams.set('brand_id', value);
          window.location.search = urlParams;
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            width: '100%',
          }}
        >
          <div style={{ width: 'calc(100% - 50px)' }}>
            <label htmlFor='#'>Giá tiền</label>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}
            >
              <div style={{ width: '40%' }}>
                <TextField
                  variant='standard'
                  label='Từ'
                  type='number'
                  value={filterPrice[0]}
                  style={{
                    textAlign: 'left',
                    width: '100%',
                    marginTop: '-10px',
                  }}
                  InputProps={{
                    inputProps: { min: 0, max: 150000000, type: 'number' },
                  }}
                  onChange={(event) =>
                    setFilterPrice([
                      event.target.value,
                      filterPrice[1] || undefined,
                    ])
                  }
                />
              </div>
              <div>→</div>
              <div style={{ width: '40%' }}>
                <TextField
                  variant='standard'
                  label='Đến'
                  type='number'
                  value={filterPrice[1]}
                  style={{
                    textAlign: 'left',
                    width: '100%',
                    marginTop: '-10px',
                  }}
                  InputProps={{
                    inputProps: { min: 0, max: 150000000, type: 'number' },
                  }}
                  onChange={(event) =>
                    setFilterPrice([
                      filterPrice[0] || undefined,
                      event.target.value,
                    ])
                  }
                />
              </div>
            </div>
          </div>

          <div
            style={{
              marginLeft: '20px',
              width: '30px',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexWrap: 'nowrap',
            }}
          >
            <div
              style={{ cursor: 'pointer', paddingRight: '30px' }}
              onClick={() => {
                if (!filterPrice[0] && !filterPrice[1]) return;

                if (
                  (typeof filterPrice[0] === 'undefined' ||
                    filterPrice[0] > -1) &&
                  (typeof filterPrice[1] === 'undefined' || filterPrice[1] > -1)
                ) {
                  if (
                    typeof filterPrice[0] !== 'undefined' &&
                    typeof filterPrice[1] !== 'undefined' &&
                    filterPrice[0] > filterPrice[1]
                  ) {
                    return toast.error(
                      'Giá trị từ phải bé hơn hoặc bằng giá trị đến trong khoảng giá tiền'
                    );
                  }
                  const urlParams = new URLSearchParams(window.location.search);
                  urlParams.set('min', filterPrice[0] || '');
                  urlParams.set('max', filterPrice[1] || '');
                  window.location.search = urlParams;
                  return;
                }
                toast.error(
                  'Giá trị trong khoảng giá tiền phải lớn hơn hoặc bằng 0'
                );
              }}
            >
              <FilterAltIcon sx={{ color: 'blue' }} />
            </div>
            <ClearIcon
              onClick={() => {
                const urlParams = new URLSearchParams(window.location.search);
                urlParams.set('min', '');
                urlParams.set('max', '');
                window.location.search = urlParams;
              }}
            />
          </div>
          
        </div>
      </div>
    </div>
  );
}
