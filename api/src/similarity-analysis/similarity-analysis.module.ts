import { Module } from "@nestjs/common";
import { SimilarityAnalysisController } from "./similarity-analysis.controller";
import { SimilarityAnalysisService } from "./similarity-analysis.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [SimilarityAnalysisController],
    providers: [SimilarityAnalysisService],
    exports: [SimilarityAnalysisService],
})
export class SimilarityAnalysisModule {}
