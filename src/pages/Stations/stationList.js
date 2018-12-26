import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { connect } from 'dva';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Progress,
  Button,
  Icon,
  Dropdown,
  Menu,
  Avatar,
  Modal,
  Form,
  Select,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';

import styles from './BasicList.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search } = Input;

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
@Form.create()
class BasicList extends PureComponent {
  state = { visible: false, done: false };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 5,
      },
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  showEditModal = item => {
    this.setState({
      visible: true,
      current: item,
    });
  };

  handleDone = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';

    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        done: true,
      });
      dispatch({
        type: 'list/submit',
        payload: { id, ...fieldsValue },
      });
    });
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/submit',
      payload: { id },
    });
  };

  render() {
    const {
      list: { list },
      loading,
    } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { visible, done, current = {} } = this.state;

    const editAndDelete = (key, currentItem) => {
      if (key === 'edit') this.showEditModal(currentItem);
      else if (key === 'delete') {
        Modal.confirm({
          title: 'حذف کار',
          content: 'آیا مطمپنید می خواهید این کار را حذف کنید؟',
          okText: 'تآیید',
          cancelText: 'لغو',
          onOk: () => this.deleteItem(currentItem.id),
        });
      }
    };

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: 'ذخیره کنید', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">همه</RadioButton>
          <RadioButton value="progress">در حال پیشرفت است</RadioButton>
          <RadioButton value="waiting">منتظر</RadioButton>
        </RadioGroup>
        <Search
          className={styles.extraContentSearch}
          placeholder="لطفا وارد شوید"
          onSearch={() => ({})}
        />
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
    };

    const ListContent = ({ data: { owner, createdAt, percent, status } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>Owner</span>
          <p>{owner}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>زمان شروع</span>
          <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
          <Progress percent={percent} status={status} strokeWidth={6} style={{ width: 180 }} />
        </div>
      </div>
    );

    const MoreBtn = props => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => editAndDelete(key, props.current)}>
            <Menu.Item key="edit">ویرایش</Menu.Item>
            <Menu.Item key="delete">حذف</Menu.Item>
          </Menu>
        }
      >
        <a>
          بیشتر <Icon type="down" />
        </a>
      </Dropdown>
    );

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="عملیات موفق"
            description="مجموعه ای از توصیفات اطلاعات، کوتاه و به طور مساوی نقطه گذاری شده است."
            actions={
              <Button type="primary" onClick={this.handleDone}>
                من می دانم
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="نام دستگاه" {...this.formLayout}>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'وارد کردن نام دستگاه الزامی است' }],
              initialValue: current.title,
            })(<Input placeholder="لطفا نام دستگاه را وارد کنید" />)}
          </FormItem>

          <FormItem label="سریال دستگاه" {...this.formLayout}>
            {getFieldDecorator('createdAt', {
              rules: [{ required: true, message: 'وارد کردن سریال دستگاه الزامی است' }],
            })(<Input placeholder="لطفا سریال دستگاه را وارد کنید" />)}
          </FormItem>

          <FormItem label="کد دستگاه" {...this.formLayout}>
            {getFieldDecorator('createdAt', {
              rules: [{ required: true, message: 'وارد کردن کد دستگاه الزامی است' }],
            })(<Input placeholder="لطفا کد دستگاه را وارد کنید" />)}
          </FormItem>

          <FormItem label="موقعیت دستگاه" {...this.formLayout}>
            {getFieldDecorator('createdAt', {
              rules: [{ required: true, message: 'وارد کردن موقعیت دستگاه الزامی است' }],
            })(<Input placeholder="لطفا موقعیت دستگاه را وارد کنید" />)}
          </FormItem>

          <FormItem label="نوع دستگاه" {...this.formLayout}>
            {getFieldDecorator('owner', {
              rules: [{ required: true, message: 'لطفا نوع دستگاه را وارد کنید' }],
              initialValue: current.owner,
            })(
              <Select placeholder="لطفا انتخاب کنید">
                <SelectOption value="CENTER PIVOT">CENTER PIVOT</SelectOption>
                <SelectOption value="AUX">AUX</SelectOption>
              </Select>
            )}
          </FormItem>

          <FormItem label="نوع دستگاه" {...this.formLayout}>
            {getFieldDecorator('owner', {
              rules: [{ required: true, message: 'لطفا نوع دستگاه را وارد کنید' }],
              initialValue: current.owner,
            })(
              <Select placeholder="لطفا انتخاب کنید">
                <option>ll</option>
              </Select>
            )}
          </FormItem>
        </Form>
      );
    };
    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="دستگاه های خاموش" value="8" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="دستگاه های روشن" value="16" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="تمام دستگاه ها" value="24" />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title="فهرست استاندارد"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={this.showModal}
              ref={component => {
                /* eslint-disable */
                this.addBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              اضافه کردن
            </Button>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a
                      onClick={e => {
                        e.preventDefault();
                        this.showEditModal(item);
                      }}
                    >
                      ویرایش
                    </a>,
                    <MoreBtn current={item} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.logo} shape="square" size="large" />}
                    title={<a href={item.href}>{item.title}</a>}
                    description={item.subDescription}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
        <Modal
          title={done ? null : `وظیفه${current ? 'ویرایش' : 'اضافه کردن'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default BasicList;
