import { ApiException } from "@/services/api/ApiException";
import { PromotionService } from "@/services/promotionService/PromotionService";
import { Promotion } from "@/types/Promotion";
import {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

type ContextProps = {
    promotion: Promotion | null;
    getPromotion: () => Promise<void>;
};

const TeacherPromotionDetailContext = createContext<ContextProps>({
    promotion: null,
    getPromotion: async () => {},
});

type Props = {
    children: ReactNode;
};

const TeacherPromotionDetailContextProvider = ({ children }: Props) => {
    const { promotionName } = useParams();

    const promotionService = useMemo(() => new PromotionService(), []);

    const [promotion, setPromotion] = useState<Promotion | null>(null);

    const getPromotion = useCallback(async () => {
        try {
            const promotionData = await promotionService.findByName(
                promotionName ?? "",
            );
            setPromotion(promotionData);
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    }, [promotionName, promotionService]);

    useEffect(() => {
        getPromotion();
    }, []);

    const data = useMemo(
        () => ({ promotion, getPromotion }),
        [promotion, getPromotion],
    );

    return (
        <TeacherPromotionDetailContext.Provider value={data}>
            {children}
        </TeacherPromotionDetailContext.Provider>
    );
};

export { TeacherPromotionDetailContext, TeacherPromotionDetailContextProvider };
