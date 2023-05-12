import { useEffect, useState } from "react";
import { Box, Divider, Flex, Heading, Stack, StackDivider, Text, useToast } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import config from "../../../utils/config";
import CustomTextArea from "../../../components/form/CustomTextArea";
import FormFildLabel from "../../../components/form/FormLabel";
import FarmStatusSelect from "../../../components/form/FarmStatusSelect";
import SaveButton from "../../../components/button/SaveButton";
import MemoFild from "../../../components/form/MemoFild";
import ReturnButton from "../../../components/fields/ReturnButton";
import FarmServices from "../../../services/FarmServices";
import { useDispatch } from "react-redux";
import DatePickerCustom from "../../../components/fields/DatePickerCustom";

interface ProductFormProps {
    value?: any;
    handleChange?: any;
    handleBlur?: any;
    errors?: any;
    touched?: any;
    setFieldValue?: any;
}

const EditForm = ({ value }: ProductFormProps) => {
    const [farmData, setFarmData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const params = useParams();
    const toast = useToast();
    const navigate = useNavigate();

    const getFarmListById = () => {
        dispatch(
            FarmServices.getFarm(
                {
                    farmId: params.id
                },
                (success: any) => {
                    const farm = success.data.rows[0];

                    setFieldValue("farm_name", farm?.farm_name);
                    setFieldValue("owner_name", farm?.owner_id?.user_name);
                    setFieldValue("register_date", farm?.register_date);
                    setFieldValue("memo", farm?.memo);
                    setFieldValue("email", farm?.email);
                    setFieldValue("contact_number", farm?.contact_number);
                    setFieldValue("address", farm?.address);
                    setFieldValue("status", farm?.status);

                    setFarmData(farm);
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

    const onSubmit = () => {
        setIsLoading(true);
        const data = {
            owner_name: values.owner_name,
            address: values.address,
            status: values.status.value,
            register_date: values.register_date,
            memo: values.memo
        };
        dispatch(
            FarmServices.updateFarm(
                { _id: params.id, data },
                (responseData: any) => {
                    toast({
                        title: t("messages.password_update_success"),
                        status: "success",
                        variant: "solid",
                        duration: 2000,
                        position: "top-right",
                        isClosable: true
                    });
                    setIsLoading(false);
                },
                (errorData: any) => {
                    setIsLoading(false);
                    toast({
                        title: errorData?.message ? errorData?.message : errorData.response?.data?.message,
                        status: "error",
                        variant: "solid",
                        duration: 2000,
                        position: "top-right",
                        isClosable: true
                    });
                }
            )
        );
        setTimeout(() => {
            navigate(`/viewfarm/${params.id}`);
        }, 2000);
    };

    const {
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldTouched,
        setFieldValue,
        resetForm,
        errors,
        touched
    } = useFormik({
        initialValues: {
            farm_name: "",
            owner_name: "",
            register_date: "",
            contact_number: "",
            email: "",
            memo: "",
            address: "",
            status: {
                lable: "",
                value: ""
            },
            contactNumber: ""
        },
        onSubmit
    });

    useEffect(() => {
        getFarmListById();
    }, []);

    return (
        <>
            <Box w={"4xl"} bg={"white"} rounded={"lg"} mt={4} pt={4}>
                <Box my={3} position={"relative"} display={"flex"} alignItems={"center"}>
                    <Stack position={"absolute"} mx={5}>
                        <ReturnButton />
                    </Stack>
                    <Text
                        p={0}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        alignContent={"center"}
                        width="full"
                    >
                        <Heading justifyContent={"center"} alignItems={"center"} alignContent={"center"} size="lg">
                            {t("farm_mgmt.edit_farm_details")}
                        </Heading>
                    </Text>
                </Box>
                <Flex flexDir={"column"} px={5} w={"full"} mt={7}>
                    <Divider />
                    <Stack divider={<StackDivider />}>
                        <Flex>
                            <Heading w={"72"} p={3} bg={"#f9fafa"} pl={12} fontSize={19} textTransform="capitalize">
                                {"ID"}
                            </Heading>
                            <Text p={3} fontSize="md">
                                {farmData?._id ? farmData?._id : "--"}
                            </Text>
                        </Flex>
                    </Stack>
                    <Divider />
                    <Stack divider={<StackDivider />} spacing="4">
                        <Flex>
                            <Heading w={"72"} p={3} bg={"#f9fafa"} pl={12} fontSize={19} textTransform="capitalize">
                                {t("farm_mgmt.farm_name")}
                            </Heading>
                            <Text p={3} fontSize="md">
                                {farmData?.farm_name ? farmData?.farm_name : "--"}
                            </Text>
                        </Flex>
                    </Stack>
                    <Divider />
                    <Stack divider={<StackDivider />} spacing="4">
                        <Flex>
                            <Heading w={"72"} p={3} bg={"#f9fafa"} pl={12} fontSize={19} textTransform="capitalize">
                                {t("farm_mgmt.owner_name")}
                            </Heading>
                            <Text p={3} fontSize="md">
                                {farmData?.owner_id?.user_name ? farmData?.owner_id?.user_name : "--"}
                            </Text>
                        </Flex>
                    </Stack>
                    <Divider />
                    <DatePickerCustom
                        label={t("common.register_date")}
                        name={"register_date"}
                        type={"date"}
                        value={values.register_date}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        errors={errors.register_date}
                        touched={touched.register_date}
                    />
                    <Divider />
                    <Stack divider={<StackDivider />} spacing="4">
                        <Flex>
                            <Heading w={"72"} p={3} bg={"#f9fafa"} pl={12} fontSize={20} textTransform="capitalize">
                                {t("common.email")}
                            </Heading>
                            <Text p={3} fontSize="md">
                                {farmData?.email ? farmData?.email : "--"}
                            </Text>
                        </Flex>
                    </Stack>
                    <Divider />
                    <Stack divider={<StackDivider />} spacing="4">
                        <Flex>
                            <Heading w={"72"} p={3} bg={"#f9fafa"} pl={12} fontSize={20} textTransform="capitalize">
                                {t("common.contact_number")}
                            </Heading>
                            <Text p={3} fontSize="md">
                                {farmData?.contact_number ? farmData?.contact_number : "--"}
                            </Text>
                        </Flex>
                    </Stack>
                    <Divider />

                    <Flex w={"full"}>
                        <FormFildLabel label={t("farm_mgmt.address")} isMandatory={false} />
                        <CustomTextArea
                            name="address"
                            // placehold={String(t("contract.up_to_500_characters"))}
                            value={values.address}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            errors={errors.address}
                            touched={touched.address}
                            isMandatory={false}
                            style={{ flex: "0.86", paddingTop: "7px", paddingBottom: "7px" }}
                        />
                    </Flex>
                    <Divider />

                    <FarmStatusSelect
                        touched={touched.status}
                        error={errors.status}
                        isMandatory={false}
                        value={values.status}
                        label={t("common.status")}
                        onChange={setFieldValue}
                        options={config.FARM_STATUS}
                        name="status"
                        multi={false}
                        onBlur={handleBlur}
                    />

                    <Divider />
                    <Stack divider={<StackDivider />} spacing="4">
                        <Flex>
                            <Heading w={"72"} p={3} bg={"#f9fafa"} pl={12} fontSize={20} textTransform="capitalize">
                                {t("farm_mgmt.postal_code")}
                            </Heading>
                            <Text p={3} fontSize="md">
                                {farmData?.postalCode ? farmData?.postalCode : "--"}
                            </Text>
                        </Flex>
                    </Stack>
                    <Divider />
                    <Stack divider={<StackDivider />} spacing="4">
                        <Flex>
                            <Heading w={"72"} p={3} bg={"#f9fafa"} pl={12} fontSize={20} textTransform="capitalize">
                                {t("farm_mgmt.prefecture")}
                            </Heading>
                            <Text p={3} fontSize="md">
                                {farmData?.prefecture ? farmData?.prefecture : "--"}
                            </Text>
                        </Flex>
                    </Stack>
                    <Divider />
                    <Stack divider={<StackDivider />} spacing="4">
                        <Flex>
                            <Heading w={"72"} p={3} bg={"#f9fafa"} pl={12} fontSize={20} textTransform="capitalize">
                                {t("farm_mgmt.city")}
                            </Heading>
                            <Text p={3} fontSize="md">
                                {farmData?.city ? farmData?.city : "--"}
                            </Text>
                        </Flex>
                    </Stack>
                    <Divider />
                    <Stack divider={<StackDivider />} spacing="4">
                        <Flex>
                            <Heading w={"72"} p={3} bg={"#f9fafa"} pl={12} fontSize={20} textTransform="capitalize">
                                {t("farm_mgmt.sub_area")}
                            </Heading>
                            <Text p={3} fontSize="md">
                                {farmData?.subArea ? farmData?.subArea : "--"}
                            </Text>
                        </Flex>
                    </Stack>
                    <Divider />
                    <Stack divider={<StackDivider />} spacing="4">
                        <Flex>
                            <Heading w={"72"} p={3} bg={"#f9fafa"} pl={12} fontSize={20} textTransform="capitalize">
                                {t("farm_mgmt.subarea_number")}
                            </Heading>
                            <Text p={3} fontSize="md">
                                {farmData?.subAreaNumber ? farmData?.subAreaNumber : "--"}
                            </Text>
                        </Flex>
                    </Stack>
                    <Divider />

                    <MemoFild
                        name="memo"
                        Type="text"
                        values={values.memo}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        errors={errors.memo}
                        touched={touched.memo}
                        label={t("farm_mgmt.memo")}
                        isMandatory={true}
                    />

                    <SaveButton isLoading={isLoading} title={t("farm_mgmt.update")} onClick={handleSubmit} />
                </Flex>
            </Box>
        </>
    );
};

export default EditForm;