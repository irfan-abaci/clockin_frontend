import React, {  useRef } from 'react';
import SubHeader, {
    SubHeaderLeft,
} from '../../layout/SubHeader/SubHeader';
import Card, {
    CardActions,
    CardBody,
    CardHeader,
    CardLabel,
    CardTitle,
} from '../../components/bootstrap/Card';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import ExportButton from '../../components/CustomComponent/Buttons/ExportButton';
import EditLogTableComponent from '../../components/MasterComponents/Settings/EditLogTableComponent';

const Index = () => {
    const urlBackup = useRef('');
    const tableRef = useRef();
    return (
            <PageWrapper title='Edit Log'>
                <SubHeader>
                    <SubHeaderLeft>
                        <CardTitle tag='div' className='h5'>
                            Edit Log
                        </CardTitle>
                    </SubHeaderLeft>
                </SubHeader>
                <Card stretch>
                    <CardHeader borderSize={1}>
                        <CardLabel icon='' iconColor='info'>
                            <CardTitle tag='div' className='h5' ><p/></CardTitle>
                        </CardLabel>
                        {/* <CardActions>
                          <ExportButton url={urlBackup} hiddenColumnsKey='' name='Edit log' />
                        </CardActions> */}
                    </CardHeader>
                    <CardBody className='table-responsive'>
                        <EditLogTableComponent
                            tableRef={tableRef}
                            urlBackup={urlBackup}
                        />
                    </CardBody>
                </Card>
            </PageWrapper>
    );
};

export default Index;
