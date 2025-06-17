import { ApiException } from "@/services/api/ApiException";
import { PromotionService } from "@/services/promotionService/PromotionService";
import { Promotion } from "@/types/Promotion";
import {
    createContext,
    ReactNode,
    useCallback,
    useMemo,
    useState,
} from "react";
import { toast } from "sonner";

type ContextProps = {
    promotions: Promotion[];
    getPromotions: () => Promise<void>;
};

const PromotionContext = createContext<ContextProps>({
    promotions: [],
    getPromotions: async () => {},
});

type Props = {
    children: ReactNode;
};

const PromotionContextProvider = ({ children }: Props) => {
    const promotionService = useMemo(() => new PromotionService(), []);

    const [promotions, setPromotions] = useState<Promotion[]>([]);

    const getPromotions = useCallback(async () => {
        try {
            const promotionsData = await promotionService.findAll();
            setPromotions(promotionsData);
        } catch (error) {
            if (error instanceof ApiException) {
                toast.error(error.message);
            }
        }
    }, [promotionService]);

    const data = useMemo(
        () => ({ promotions, getPromotions }),
        [promotions, getPromotions],
    );

    return (
        <PromotionContext.Provider value={data}>
            {children}
        </PromotionContext.Provider>
    );
};

export { PromotionContext, PromotionContextProvider };
