import { Badge, Box, Flex, Text, useCallbackRef, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import DataTableComponent from "../../../components/Table/DataTable";
import { useTranslation } from "react-i18next";
import MainHeading from "../../../components/menu/MainHeading";
import { globalStyles } from "../../../theme/styles";
import SearchButton from "../../../components/button/SearchButton";
import ResetButton from "../../../components/button/ResetButton";
import ReactDatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import InputSelect from "../../../components/select/InputSelect";
import { useFormik } from "formik";
import MySelect from "../../../components/select/MySelect";
import SmallFormLabel from "../../../components/fields/SmallFormLabel";
import config from "../../../utils/config";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import CameraService from "../../../services/CameraService";
import FarmServices from "../../../services/FarmServices";
import ExportExcel from "../../../components/button/Excelexport";
import ja from "date-fns/locale/ja";

const CameraManagement = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const onChange = (dates: any) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };
    const [searchForm, setSearchForm] = useState({
        name: "",
        email: "",
        phone: "",
        status: ""
    });
    const [isLoading, setIsLoading] = useState<any>(false);
    const today = new Date();
    const [endDate, setEndDate] = useState(today);
    const [constructionStartDate, setConstructionStartDate] = useState(
        new Date(today.getFullYear(), today.getMonth(), 1)
    );
    const [constructionEndDate, setConstructionEndDate] = useState(today);
    const [startDate, setStartDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [closingDate, setClosingDate] = useState(today);
    const [cameradata, setCameraData] = useState<any>([]);
    const [farmName, setFarmName] = useState<any>([]);
    const [filterData, setFilterData] = useState([]);
    const toast = useToast();
    const [disableReset, setDisableReset] = useState<boolean>(true);
    const dispatch = useDispatch();

    function handleClick() {
        navigate("/add-farm");
    }

    const handleSearchData = () => {
        // setDisableReset(false);
        getCameraList(false);
    };

    function handleCamera(row: any) {
        navigate(`/camera-view/${row._id}`, { state: "/camera-management" });
    }

    const getExcelData = async () => {
        const arrayOfId = cameradata.map((data: any, index: any) => data._id);
        const excelData: any = await new Promise((resolve, reject) => {
            dispatch(
                CameraService.DownloadCameraList(
                    {
                        id: arrayOfId
                    },
                    (successData: any) => {
                        resolve(successData?.data?.rows);
                        toast({
                            title: successData.message ? successData.message : successData?.data?.message,
                            status: "success",
                            duration: 3 * 1000,
                            isClosable: true,
                            position: "top-right"
                        });
                    },
                    (errorData: any) => {
                        toast({
                            title: errorData.message ? errorData.message : errorData?.data?.message,
                            status: "error",
                            duration: 3 * 1000,
                            isClosable: true,
                            position: "top-right"
                        });
                        reject();
                    }
                )
            );
        });

        return excelData;
    };

    const { values, handleChange, handleSubmit, setFieldValue, resetForm, setFieldTouched, dirty } = useFormik({
        initialValues: {
            name: "",
            farm_id: {
                label: "",
                value: ""
            },
            registerDate: undefined,

            camera_access: {
                label: "",
                value: ""
            },
            status: {
                label: "",
                value: ""
            }
        },
        onSubmit: handleSearchData
    });

    const handleReset = () => {
        setCameraData([]);
        setFieldValue("registerDate", null);
        getCameraList(true);
        resetForm();
    };

    const column = [
        {
            id: 1,
            name: <Text fontWeight={"bold"}>{t("common.name")}</Text>,
            selector: (row: any) => row?.name,
            sortable: true,
            wrap: true,
            cell: (row: any) => {
                return (
                    <Box>
                        <Text
                            color={globalStyles.colors.mainColor}
                            fontWeight={"normal"}
                            textTransform={"uppercase"}
                            cursor={"pointer"}
                        >
                            {row.name ?? "--"}
                        </Text>
                    </Box>
                );
            },
            width: "130px"
        },
        {
            id: 2,
            name: <Text fontWeight={"bold"}>{t("device_mgmt.mac_address")}</Text>,
            selector: (row: any) => row?.mac_address,
            sortable: true,
            wrap: true,
            width: "180px"
        },
        {
            id: 3,
            name: <Text fontWeight={"bold"}>{t("farm_mgmt.farm")}</Text>,
            selector: (row: any) => (row?.farm_id?.farm_name ? row?.farm_id?.farm_name : "--"),
            sortable: true,
            wrap: true,
            width: "150px"
        },
        {
            id: 4,
            name: <Text fontWeight={"bold"}>{t("device_mgmt.location")}</Text>,
            selector: (row: any) => (row?.location ? row?.location : "--"),
            sortable: true,
            wrap: true,
            width: "180px"
        },
        {
            id: 5,
            name: <Text fontWeight={"bold"}>{t("common.register_date")}</Text>,
            selector: (row: any) => row?.register_date,
            cell: (row: any) => (
                <Text>{row?.register_date ? dayjs(row?.register_date).format("YYYY/MM/DD") : "--"}</Text>
            ),
            sortable: true,
            wrap: true,
            width: "150px"
        },
        {
            id: 6,
            name: (
                <Text fontWeight={"bold"} w={"full"} display={"flex"} justifyContent={"center"}>
                    {t("common.status")}
                </Text>
            ),
            selector: (row: any) => row?.status,
            sortable: true,
            wrap: true,

            cell: (row: any) => (
                <Badge variant={row?.status === "OPERATIONAL" ? "success" : "danger"}>
                    {row?.status === "OPERATIONAL" ? t("status.operational") : t("status.non_operational")}
                </Badge>
            ),
            width: "200px"
        }
    ];

    const getFarmName = () => {
        dispatch(
            FarmServices.getName(
                {},
                (success: any) => {
                    let newArray: any = [];
                    success?.data?.rows.map((farmDetails: any, index: any) => {
                        newArray.push({
                            label: farmDetails.farm_name,
                            value: farmDetails._id
                        });
                        setFarmName(newArray);
                    });
                },
                (errorData: any) => {
                    toast({
                        title: errorData.message ? errorData.message : errorData?.data?.message,
                        status: "error",
                        duration: 3 * 1000,
                        isClosable: true,
                        position: "top-right"
                    });
                }
            )
        );
    };

    const getCameraList = (isReset: boolean) => {
        setIsLoading(true);
        if (!isReset) {
            const name = values.name;
            const farm = values.farm_id.value;
            const registerDate = values.registerDate;
            const camera_access = values.camera_access.value;
            let formattedRegisterDate = "";
            if (registerDate) {
                formattedRegisterDate = dayjs(registerDate).format("YYYY-MM-DD");
            }

            const status = values.status.value;
            dispatch(
                CameraService.getCamera(
                    {
                        name: name ?? undefined,
                        farm_id: farm ?? undefined,
                        status: status ?? undefined,
                        camera_access: camera_access ?? undefined,
                        register_date: formattedRegisterDate ?? undefined,
                        limit: 5000
                    },
                    (success: any) => {
                        setCameraData(success.data.rows);
                        setIsLoading(false);
                    },
                    (errorData: any) => {
                        setIsLoading(false);
                    }
                )
            );
        } else {
            dispatch(
                CameraService.getCamera(
                    {},
                    (success: any) => {
                        setCameraData(success.data.rows);
                        setIsLoading(false);
                    },
                    (errorData: any) => {
                        setIsLoading(false);
                    }
                )
            );
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);

    useEffect(() => {
        getCameraList(false), getFarmName();
    }, []);

    return (
        <>
            <Box>
                <MainHeading title={t("Camera")} />
            </Box>

            <Box bgColor={"white"} p={4} rounded={"lg"} my={3} mt={2}>
                <Text display={"flex"} fontWeight={"bold"} mb={3}>
                    {t("common.search_condition")}
                </Text>
                <Flex gap={5} w={"full"} flexWrap={{ base: "nowrap", xl: "wrap", lg: "wrap", md: "wrap" }}>
                    <Flex flexDir={"column"} mt={2} gap={3} w={"xs"}>
                        <InputSelect
                            label={t("common.name")}
                            value={values.name}
                            handleChange={handleChange}
                            name={"name"}
                            type="text"
                        />
                        <Flex justifyContent={"space-between"}>
                            <SmallFormLabel title={t("device_mgmt.farm_name")} />
                            <MySelect
                                value={values.farm_id}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                options={farmName}
                                name={"farm_id"}
                                multi={false}
                            />
                        </Flex>

                        <Flex justifyContent={"space-between"} gap={3}>
                            <Text fontSize={14}>{t("common.register_date")}</Text>

                            <Box>
                                <ReactDatePicker
                                    dateFormat="yyyy/MM/dd"
                                    className="form-date"
                                    locale={ja}
                                    selected={values.registerDate}
                                    onChange={(date: any) => {
                                        setFieldValue("registerDate", date);
                                    }}
                                />
                            </Box>
                        </Flex>
                    </Flex>

                    <Flex flexDir={"column"} gap={3} mt={2} w={"80"}>
                        <Flex justifyContent={"space-between"}>
                            <SmallFormLabel title={t("common.status")} />
                            <MySelect
                                value={values.status}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                options={config.CAMERA_STATUS}
                                name="status"
                                multi={false}
                            />
                        </Flex>
                    </Flex>

                    <Box w={"0.5px"} h={"32"} bgColor={globalStyles.colors.mainColor} />
                    <Flex gap={2} mb={2} flexDir={"column"} ml={4}>
                        {/* <ExportExcel /> */}
                        <Box w="36"></Box>
                        <ExportExcel getExcelData={getExcelData} fileName={"カメラ"} />
                        <SearchButton isLoading={isLoading} handleSearchData={handleSubmit} />
                        <ResetButton isDisabled={!dirty && disableReset} handleReset={handleReset} />
                    </Flex>
                </Flex>
            </Box>

            <Box rounded={"lg"} bgColor={"white"} px={5}>
                <DataTableComponent handleSubmit={handleCamera} column={column} data={cameradata} />
            </Box>
        </>
    );
};

export default CameraManagement;
