import { useState } from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useToast
} from "@chakra-ui/react";

// redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";

import FaqService from "../../services/FaqService";

import { useTranslation } from "react-i18next";

import FooterModal from "./FooterModal";
import { globalStyles } from "../../theme/styles";

interface IProps {
    isOpen: boolean;
    onClose: () => void;
    getAllFaq?: any;
    getAllSection?: any;
}

const SectionModal = ({ isOpen, onClose, getAllFaq, getAllSection }: IProps) => {
    const toast = useToast();
    const dispatch = useDispatch<AppDispatch>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const faqDetails = useSelector((state: any) => state?.FAQ?.selectedFAQ);
    const { t } = useTranslation();

    const handleConfirm = () => {
        setIsLoading(true);

        if (faqDetails?.type == "section") {
            // updateSection
            const data = {
                sectionId: faqDetails?._id,
                status: !faqDetails?.enabled
            };

            dispatch(
                FaqService.updateSection(
                    { data },
                    (responseData: any) => {
                        setIsLoading(false);
                        toast({
                            title: "セクションを更新しました",
                            status: "success",
                            variant: "solid",
                            duration: 2000,
                            position: "top-right",
                            isClosable: true
                        });
                        getAllSection();
                        onClose();
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
        } else {
            const data = {
                faq_id: faqDetails?._id,
                // sectionId: faqDetails?._id,

                enabled: !faqDetails?.enabled
            };
            dispatch(
                FaqService.updateFaq(
                    { data },
                    (responseData: any) => {
                        setIsLoading(false);
                        toast({
                            title: "FAQーを更新しました",
                            status: "success",
                            variant: "solid",
                            duration: 2000,
                            position: "top-right",
                            isClosable: true
                        });
                        getAllFaq();
                        onClose();
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
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {faqDetails?.enabled
                        ? faqDetails?.type === "section"
                            ? t("faq_mgmt.disable_section")
                            : "質問非公開"
                        : faqDetails?.type === "section"
                        ? t("faq_mgmt.enable_section")
                        : "質問公開"}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {faqDetails?.enabled
                        ? faqDetails?.type === "section"
                            ? "セクションを非公開にしますか？"
                            : "質問を非公開にしますか？"
                        : faqDetails?.type === "section"
                        ? t("faq_mgmt.make_section_public")
                        : "質問を公開しますか?"}
                    <br />
                    {faqDetails?.enabled
                        ? faqDetails?.type === "section"
                            ? t("messages.information_you_have_made_private")
                            : "非公開にした情報はユーザー/店舗アカウントに表示されません"
                        : faqDetails?.type === "section"
                        ? t("messages.information_you_have_made_public")
                        : "公開した情報はユーザー/店舗アカウントに表示されます"}
                </ModalBody>

                <ModalFooter>
                    {/* <FooterModal
                        type="delete"
                        isLoading={isLoading}
                        handleDelete={handleConfirm}
                        handleClose={onClose}
                    />
                     */}
                    <Button
                        colorScheme={
                            faqDetails?.enabled
                                ? faqDetails?.type === "section"
                                    ? "green"
                                    : "green"
                                : faqDetails?.type === "section"
                                ? "red"
                                : "green"
                        }
                        mr={2}
                        onClick={handleConfirm}
                        isLoading={isLoading}
                    >
                        {" "}
                        {faqDetails?.enabled
                            ? faqDetails?.type === "section"
                                ? t("common.private")
                                : t("common.keep")
                            : faqDetails?.type === "section"
                            ? t("common.keep")
                            : t("common.keep")}
                    </Button>
                    <Button bgColor={globalStyles.colors.btn.blue} color="white" mr={3} onClick={onClose}>
                        {t("common.cancel")}
                    </Button>{" "}
                    {/* <Button colorScheme="blue" mr={3} onClick={() => setShow(!show)}>
                        {t("faq.cancel")}
                    </Button>
                    <Button
                        isLoading={isLoading}
                        loadingText="Loading..."
                        colorScheme="red"
                        onClick={() => handleConfirm()}
                    >
                        {t("faq.confirm")}
                    </Button> */}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default SectionModal;
