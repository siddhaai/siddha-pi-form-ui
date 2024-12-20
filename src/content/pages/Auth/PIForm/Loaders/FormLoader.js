import React from 'react';
import '../Styles.css';
import { Grid } from '@mui/material';
import FormLoadingGif from '../../../../../assets/Forms.gif';

function FormLoader() {
  return (
    <Grid
      container
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Grid
        item
        xs={12}
        sm={4}
        md={4}
        lg={4}
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        alignContent={'center'}
      >
        <img
          src={FormLoadingGif}
          alt="Loading..."
          // width={'200px'}
          // height={'200px'}
        />
        <div className='loading_cont'>
          <div class="loadingtext">
            <p>Submitting Your Form</p>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}

export default FormLoader;
