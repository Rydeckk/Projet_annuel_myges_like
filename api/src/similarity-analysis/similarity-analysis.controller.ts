import { Controller, Get, Post, Param, Body, UseGuards } from "@nestjs/common";
import { SimilarityAnalysisService } from "./similarity-analysis.service";
import { JwtAuthGuard } from "src/auth/strategies/jwt/jwt-auth.guard";
import { AnalyzeProjectDto } from "./dto/similarity-analysis.dto";

@Controller("similarity")
@UseGuards(JwtAuthGuard)
export class SimilarityAnalysisController {
    constructor(
        private readonly similarityAnalysisService: SimilarityAnalysisService,
    ) {}

    @Post("analyze")
    analyzeProject(@Body() analyzeDto: AnalyzeProjectDto) {
        return this.similarityAnalysisService.analyzeProject(
            analyzeDto.promotionProjectId,
        );
    }

    @Get("project/:id")
    getProjectResults(@Param("id") promotionProjectId: string) {
        return this.similarityAnalysisService.getProjectResults(
            promotionProjectId,
        );
    }

    @Get("deliverable/:id")
    getDeliverableResults(@Param("id") deliverableId: string) {
        return this.similarityAnalysisService.getDeliverableResults(
            deliverableId,
        );
    }
}
