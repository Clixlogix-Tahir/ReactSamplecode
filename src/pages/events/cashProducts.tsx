/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { Fragment } from 'react';
import { XHR_STATE } from '../../common/constants';
import { useAppDispatch, useAppSelector, useShouldShowPlaceholder } from '../../common/hooks';
import NoAppPlaceholder from '../../components/no-app-placeholder';
import { eventApiDispatchers } from './eventSlice';
import AddProduct from './nudge-fields/addProduct';

function CashProducts(props: any) {
  const dispatch = useAppDispatch();
  const shouldShowPlaceholder = useShouldShowPlaceholder();
  const { products } = useAppSelector(state => state.eventSlice);
  const { apps, selectedApp } = useAppSelector(state => state.gameConfigForm);
  const [showAddProductModal, setShowAddProductModal] = React.useState(false);

  React.useEffect(() => {
    if (selectedApp) {
      dispatch(eventApiDispatchers.getCashProducts(selectedApp));
    }
  }, [selectedApp]);

  const addNewProduct = () => {
    setShowAddProductModal(true);
  };

  return (
    <div>
      {shouldShowPlaceholder &&
        apps.loading !== XHR_STATE.IN_PROGRESS &&
        <NoAppPlaceholder
          imageUrl={'https://assets.onclixlogix-samplecode.com/website/img/icons/illustration-calendar.svg'}
          text={'You can set up your Live-ops events here. To see the events create a new app.'}
        />
      }
      {!shouldShowPlaceholder &&
      <Fragment>
      <Button
        variant="contained"
        color="primary"
        onClick={addNewProduct}
        style={{ marginBottom: '2rem' }}
      >
        Add New Product
      </Button>
      <AddProduct
        open={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onOkClick={() => {}}
        onSuccess={() => dispatch(eventApiDispatchers.getCashProducts(selectedApp))}
      />
      <Grid container style={{ margin: '12px 0' }}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table aria-label="Events table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Readable ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Highlight label</TableCell>
                  <TableCell>Currency</TableCell>
                  <TableCell>Amt.</TableCell>
                  <TableCell>Offer %</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Offer amt.</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.loading === XHR_STATE.IN_PROGRESS &&
                  [1, 2, 3, 4, 5].map(i => <TableRow>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(ii =>
                      <TableCell>
                        <Skeleton width={50} />
                      </TableCell>
                    )}
                  </TableRow>)
                }
                {products.productsList.map((product, productIndex) =>
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.readableId}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.highlightLabel}</TableCell>
                    <TableCell>{product.currency}</TableCell>
                    <TableCell>{product.amount}</TableCell>
                    <TableCell>{product.offerPercent}</TableCell>
                    <TableCell>{product.type}</TableCell>
                    <TableCell>{product.offerAmount}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      </Fragment>
      }
    </div>
  );
}

export default CashProducts;
