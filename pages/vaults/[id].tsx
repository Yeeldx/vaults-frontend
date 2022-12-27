import Head from "next/head";
import { useRouter } from "next/router";
import { ethers } from "ethers";

import Router from "next/router";
import { useMetaMask } from "../../hooks/useMetaMask";
import React, { useState, useEffect } from "react";
import UserPanel from "../../components/Layout/Default/UserPanel";
import erc20Abi from "../../lib/erc20.abi.json";
import vaultAbi from "../../lib/vault.abi.json";

import { Vault__factory } from "../../lib/factory";

import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  message,
  Upload,
  Card,
  Checkbox,
  Drawer,
  Descriptions,
  Tabs,
} from "antd";
import {
  ExclamationCircleOutlined,
  LoadingOutlined,
  InboxOutlined,
  EditOutlined,
  EditTwoTone,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import { api } from "../../libraries/api";
import moment from "moment";
import Link from "next/link";
const { TextArea } = Input;
const { confirm } = Modal;
const { TabPane } = Tabs;

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   Label,
//   ResponsiveContainer,
// } from "recharts";

const Page = ({ session, formFields }) => {
  const router = useRouter();
  const { locale: activeLocale } = router;
  const { id } = router.query;
  const [data, setData] = useState();
  const [form] = Form.useForm();
  const [isApprovalNeeded, setIsApprovalNeeded] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    state: { wallet },
  } = useMetaMask();

  const [provider, setProvider] = useState({});
  const [account, setAccount] = useState("");

  useEffect(() => {
    setProvider(new ethers.providers.Web3Provider(window.ethereum));

    api
      .get("/api/vaults/" + id)
      .then(async ({ data: result }) => {
        console.log("result.data", result.data);
        setData(result.data);

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        console.log("acc", accounts);

        setAccount(accounts[0]);

        form.setFieldsValue({
          from: accounts[0],
          to: result.data.address,
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [router, id]);

  const changeTab = async (key) => { };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = async (values) => {
    setLoading(true);

    
    values._value = ethers.utils.parseUnits(values.amount, "ether").toString();
    values._spender = values.from;

    const signer = provider?.getSigner();

    //condition check and call required method
    if (isApprovalNeeded) {
      //   /** Approval Transaction */
      const tokenContract = new ethers.Contract(data?.token.address, erc20Abi, signer);

      const approve = await tokenContract.approve(
        data?.address,
        ethers.utils.parseUnits(values.amount),
        {
          gasLimit: 1000000,
        }
      );
      console.log("approve", approve);
      setIsApprovalNeeded(false);
      setLoading(false);
    } else {
      /** Deposit Transaction */
      const vaultContract = new ethers.Contract(data?.address, vaultAbi, signer);
      console.log(vaultContract);
      vaultContract
        .deposit(
          ethers.utils.parseUnits(values.amount),
          {
            gasLimit: 1000000,
          })
        .then(async (tx: any) => {
          console.log("Token deposited");
          setLoading(false);

          await tx.wait(1);
          console.log(`Token deposit complete : ${tx}`);
          router.reload();
        })
        .catch((error: any) => {
          console.log(error);
          /*setError(true);
          setErrorMessage(error?.message);
          setIsMinting(false);*/
        });
    }
  };

  const handleAmountOnchange = async (event) => {
    setLoading(true);
    //add allowance check here
    // if allowance needed call setIsApprovalNeeded(true) else setIsApprovalNeeded(false)

    /**
     * TODO see if tokenContract can be made global to avoid code duplication. refer onFinish method.
     * */
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(data?.token.address, erc20Abi, signer);

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    console.log("account", accounts[0]);
    console.log("input amount", event.target.value);

    const allowance = await tokenContract.allowance(accounts[0], data?.address);
    console.log("allowance", allowance.toString());

    const inputtedAmount = ethers.utils.parseUnits(event.target.value);
    console.log("inputtedAmount", inputtedAmount);
    console.log("inputtedAmount.toString()", inputtedAmount.toString());

    if (allowance >= inputtedAmount) {
      setIsApprovalNeeded(false);
    } else {
      setIsApprovalNeeded(true);
    }
    setLoading(false);
  };

  return (
    <React.Fragment>
      <Head>
        <title>{data?.name} - Yeeldx</title>
      </Head>

      <section className="rfq-updates Blade_rfq_updates">
        <div className="grid-wrapper">
          <div className="row">
            <div className="col-md-3 col col-12">
              <div className="rfq-value">
                <div className="icon-wrapper">
                  <span className="icon"></span>
                </div>
                <div className="content-wrapper">
                  <div className="title">Total deposited</div>
                  <div className="number">
                    {Number(data?.tvl?.tvl_deposited).toFixed(2)}
                  </div>
                  <div className="wrapper">
                    {/* <div className="description">
                      {t("rfqReceivedTillDate")}
                    </div> */}
                    <div className="value-wrapper">
                      <span className="label"></span>
                      <span className="value">{"10,500,298.71"}</span>
                    </div>
                  </div>
                  {/*
                    <div class="button-wrapper">
                      <a class="know-more">Know more</a>
                    </div>
                  */}
                </div>
              </div>
            </div>
            <div className="col-md-3 col col-12">
              <div className="rfq-value">
                <div className="icon-wrapper">
                  <span className="icon"></span>
                </div>
                <div className="content-wrapper">
                  <div className="title">Net APY</div>
                  <div className="number">
                    {Number(data?.apy?.net_apy).toFixed(2)}%
                  </div>
                  <div className="wrapper">
                    {/* <div className="description">
                      {t("rfqReceivedTillDate")}
                    </div>
                    <div className="value-wrapper">
                      <span className="label">{t("valueOfRFQ")}</span>
                      <span className="value">
                        {t("aed")} {counterWidgetData.total.value}
                      </span>
                    </div> */}
                  </div>
                  {/*
                    <div class="button-wrapper">
                      <a class="know-more">Know more</a>
                    </div>
                  */}
                </div>
              </div>
            </div>

            <div className="col-md-3 col col-12">
              <div className="rfq-value">
                <div className="icon-wrapper">
                  <span className="icon"></span>
                </div>
                <div className="content-wrapper">
                  <div className="title">Balance</div>
                  <div className="number">{"0.00"}</div>
                  <div className="wrapper">
                    <div className="value-wrapper">
                      <span className="label"></span>
                      <span className="value">{"0.00"}</span>
                    </div>
                  </div>
                  {/*
                    <div class="button-wrapper">
                      <a class="know-more">Know more</a>
                    </div>
                  */}
                </div>
              </div>
            </div>

            <div className="col-md-3 col col-12">
              <div className="rfq-value">
                <div className="icon-wrapper">
                  <span className="icon"></span>
                </div>
                <div className="content-wrapper">
                  <div className="title">Earned</div>
                  <div className="number">{"0.00"}</div>
                  <div className="wrapper">
                    <div className="value-wrapper">
                      <span className="label"></span>
                      <span className="value">{"0.00"}</span>
                    </div>
                  </div>
                  {/*
                    <div class="button-wrapper">
                      <a class="know-more">Know more</a>
                    </div>
                  */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rfq-detail">
        <div className="row">
          <div className="col-md-12 col">
            <Form
              name="form"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
              size="medium"
              form={form}
              scrollToFirstError
              className="common-form card-form"
              requiredMark={false}
            >
              <Card
                title={"Deposit"}
                actions={
                  [
                    // <div className="row col-xl-12" style={{ float: "left" }}>
                    //   <Button
                    //     style={{ float: "left", marginRight: 10 }}
                    //     className="form-save"
                    //     key="submit"
                    //     htmlType="submit"
                    //     type="primary"
                    //   >
                    //     {t("submitQuotation")}
                    //   </Button>
                    //   <Button className="form-cancel" key="back" htmlType="reset">
                    //     {t("reset")}
                    //   </Button>
                    // </div>,
                  ]
                }
              >
                <div className="row">
                  <div className="col-xl-3 col-lg-3 col-md-3">
                    <Form.Item hidden name="rfq">
                      <Input type="hidden" />
                    </Form.Item>
                    <Form.Item
                      label={"From Wallet"}
                      rules={[{ required: true, message: "" }]}
                      name="from"
                    >
                      <Input placeholder="SL-0001" />
                    </Form.Item>
                  </div>
                  <div className="col-xl-3 col-lg-3 col-md-3">
                    <Form.Item
                      label={"Amount"}
                      rules={[{ required: true, message: "" }]}
                      name="amount"
                    >
                      <Input placeholder="10" onChange={handleAmountOnchange} />
                    </Form.Item>
                  </div>
                  <div className="col-xl-3 col-lg-3 col-md-3">
                    <Form.Item
                      label={"To Vault"}
                      rules={[{ required: true, message: "" }]}
                      name="to"
                    >
                      <Input placeholder={"SL-0001"} />
                    </Form.Item>
                  </div>
                  {/* <div className="col-xl-3 col-lg-3 col-md-3">
                    <Form.Item
                      label={"You Will Recieve"}
                      rules={[{ required: true, message: "" }]}
                      name="recieve"
                    >
                      <Input placeholder="10" />
                    </Form.Item>
                  </div> */}

                  <div className="col-xl-3 col-lg-3 col-md-3">
                    <Form.Item label={" "} name="recieve">
                      {isApprovalNeeded ? (
                        <Button
                          style={{}}
                          className="form-save"
                          key="submit"
                          htmlType="submit"
                          type="primary"
                          value={""}
                          loading={loading}
                        >
                          {"Approve"}
                        </Button>
                      ) : (
                        <Button
                          style={{}}
                          className="form-save"
                          key="submit"
                          htmlType="submit"
                          type="primary"
                          value={""}
                          loading={loading}
                        >
                          {"Deposit"}
                        </Button>
                      )}
                    </Form.Item>
                  </div>
                </div>
              </Card>
            </Form>
          </div>
        </div>
      </section>

      <br></br>

      <Tabs
        onTabClick={changeTab}
        defaultActiveKey="about"
        className="common-tabs"
      >
        <TabPane tab={"About"} key="about">
          <section className="rfq-detail">
            <div className="row">
              <div className="col-md-12 col">
                <div className="common-card rfq-details">
                  <div className="grid-wrapper">
                    <div className="row">
                      <div className="col-md-7 col">
                        <div className="top-wrapper">
                          <div className="title">
                            <h5>Description</h5>
                          </div>
                          <div className="description">
                            <p>{data?.token?.description}</p>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-4 col">
                        <div className="top-wrapper">
                          <div className="title">
                            <h5>Chart</h5>
                          </div>
                          <section className="db-sales">
                            <div className="grid-wrapper">
                              <div className="row">
                                <div className="col-md-12 col-lg-9 col-12 col">
                                  <div className="common-card sale-summary">
                                    {/* <ResponsiveContainer
                                      width="100%"
                                      height="100%"
                                    >
                                      <LineChart
                                        width={500}
                                        height={240}
                                        data={chartData}
                                        margin={{
                                          top: 0,
                                          right: 0,
                                          left: 20,
                                          bottom: 8,
                                        }}
                                      >
                                        <CartesianGrid strokeDasharray="7" />
                                        <XAxis
                                          dataKey="name"
                                          label={{
                                            value: t("orderDate"),
                                            offset: -7,
                                            position: "insideBottom",
                                          }}
                                        />
                                        <YAxis
                                          dataKey="uv"
                                          tickFormatter={DataFormater}
                                        >
                                          <Label
                                            value={t("totalSalesValue")}
                                            position="insideLeft"
                                            offset={-5}
                                            angle={-90}
                                            style={{ textAnchor: "middle" }}
                                          />
                                        </YAxis>
                                        <Tooltip />
                                        <Legend
                                          verticalAlign="top"
                                          height={36}
                                        />
                                        <Line
                                          // name="revenue"
                                          type="monotone"
                                          dataKey="amt"
                                          name="Order Value"
                                          stroke="#da634a"
                                          tickFormatter={DataFormater}
                                        />
                                      </LineChart>
                                    </ResponsiveContainer> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </TabPane>

        <TabPane tab={"Strategies"} key="strategies">
          <section className="rfq-detail">
            <div className="row">
              <div className="col-md-12 col">
                <div className="common-card rfq-details">
                  <div className="grid-wrapper">
                    <div className="row">
                      <div className="col-md-7 col">
                        <div className="top-wrapper">
                          <div className="title">
                            <h5>Strategies</h5>
                          </div>
                          {data?.strategies?.map((stargey, index) => {
                            return (
                              <Descriptions
                                title=""
                                layout="horizontal"
                                column={1}
                                bordered
                              >
                                <Descriptions.Item label="Address">
                                  {stargey.address}
                                </Descriptions.Item>

                                <Descriptions.Item label="Name">
                                  {stargey.name}
                                </Descriptions.Item>

                                <Descriptions.Item label="Description" span={2}>
                                  <p>{stargey.description}</p>
                                </Descriptions.Item>
                              </Descriptions>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </TabPane>

        <TabPane tab={"Historical Rates"} key="rates">
          <section className="rfq-detail">
            <div className="row">
              <div className="col-md-12 col">
                <div className="common-card rfq-details">
                  <div className="grid-wrapper">
                    <div className="row">
                      <div className="col-md-7 col">
                        <div className="top-wrapper">
                          <div className="title">
                            <h5>Strategies</h5>
                          </div>
                          {data?.strategies?.map((stargey, index) => {
                            return (
                              <Descriptions
                                title=""
                                layout="horizontal"
                                column={1}
                                bordered
                              >
                                <Descriptions.Item label="Address">
                                  {stargey.address}
                                </Descriptions.Item>

                                <Descriptions.Item label="Name">
                                  {stargey.name}
                                </Descriptions.Item>

                                <Descriptions.Item label="Description" span={2}>
                                  <p>{stargey.description}</p>
                                </Descriptions.Item>
                              </Descriptions>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </TabPane>
      </Tabs>
    </React.Fragment>
  );
};
const Breadcrumb = ({ }) => {
  const router = useRouter();
  const { id } = router.query;
  const [rfqData, setRfqData] = useState({});

  const [data, setData] = useState();
  const [form] = Form.useForm();

  useEffect(() => {
    api
      .get("/api/vaults/" + id)
      .then(({ data: result }) => {
        setRfqData(result.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  });

  return (
    <>
      <h1 className="back-heading">
        {" "}
        {rfqData.display_name} - {rfqData.symbol}
      </h1>
      <div className="status-date">
        <span className="status pending">{rfqData.status}</span>
        <span className="date">Address - {rfqData.address}</span>
        <span className="time">Category - {rfqData.category}</span>
      </div>
    </>
  );
};

const panel = ({ }) => {
  return <UserPanel Breadcrumb={Breadcrumb}></UserPanel>;
};
Page.Breadcrumb = panel;
export default Page;

export async function getServerSideProps(context) {
  const { req, res, params, locale } = context;
  const session = {};
  let rfq = {};
  let formFields = {};
  try {
  } catch (err) {
    console.log(err);
  }

  return {
    props: {
      session,
      formFields: formFields,
      rfq,
    },
  };
}
