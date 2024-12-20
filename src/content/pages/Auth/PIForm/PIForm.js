// import { Helmet } from 'react-helmet-async';
import TestTableData from './TestTableData';
import { Grid } from '@mui/material';

// import PageHeader from './PageHeader';
// import PageTitleWrapper from 'src/components/PageTitleWrapper';

function PIForm() {
  return (
    <>
      {/* <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper> */}

      {/* <Grid
        sx={{
          px: 4
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      > */}
      <div>
        <TestTableData />
      </div>
      {/* </Grid> */}
    </>
  );
}

export default PIForm;
