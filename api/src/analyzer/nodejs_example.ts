import { spawn, ChildProcess } from "child_process";

interface ComparisonOptions {
    output?: string;
    format?: string;
    timeout?: number;
    workers?: number;
    threshold?: number;
}

interface BatchAnalyzeOptions {
    threshold?: number;
    config?: string;
}

interface ComparisonResult {
    success: boolean;
    global_similarity: number;
    is_suspicious: boolean;
    error?: string;
}

class ArchiveAnalyzerBridge {
    private pythonPath: string;
    private scriptPath: string;

    constructor(pythonPath = "python", scriptPath = "nodejs_bridge.py") {
        this.pythonPath = pythonPath;
        this.scriptPath = scriptPath;
    }

    async compare(
        archive1: string,
        archive2: string,
        options: ComparisonOptions = {},
    ): Promise<ComparisonResult> {
        const args = [
            this.scriptPath,
            "compare",
            "--archive1",
            archive1,
            "--archive2",
            archive2,
        ];

        if (options.output) args.push("--output", options.output);
        if (options.format) args.push("--format", options.format);
        if (options.timeout) args.push("--timeout", options.timeout.toString());
        if (options.workers) args.push("--workers", options.workers.toString());
        if (options.threshold)
            args.push("--threshold", options.threshold.toString());

        return this.executeCommand(args);
    }

    async batchAnalyze(
        directory: string,
        options: BatchAnalyzeOptions = {},
    ): Promise<ComparisonResult> {
        const args = [this.scriptPath, "batch", "--directory", directory];

        if (options.threshold)
            args.push("--threshold", options.threshold.toString());
        if (options.config) args.push("--config", options.config);

        return this.executeCommand(args);
    }

    private executeCommand(args: string[]): Promise<ComparisonResult> {
        return new Promise((resolve, reject) => {
            const python: ChildProcess = spawn(this.pythonPath, args);
            let output = "";
            let errorOutput = "";

            python.stdout?.on("data", (data: Buffer) => {
                output += data.toString();
            });

            python.stderr?.on("data", (data: Buffer) => {
                errorOutput += data.toString();
            });

            python.on("close", (code) => {
                if (code !== 0) {
                    reject(
                        new Error(
                            `Python process exited with code ${code}: ${errorOutput}`,
                        ),
                    );
                    return;
                }

                try {
                    const result = JSON.parse(output) as ComparisonResult;
                    if (!result.success) {
                        reject(new Error(result.error || "Unknown error"));
                    } else {
                        resolve(result);
                    }
                } catch (error) {
                    const errorMessage =
                        error instanceof Error
                            ? error.message
                            : "Unknown error";
                    reject(
                        new Error(
                            `Failed to parse output: ${errorMessage}\nOutput: ${output}`,
                        ),
                    );
                }
            });

            python.on("error", reject);
        });
    }
}

// Example usage
async function runExample(): Promise<void> {
    const analyzer = new ArchiveAnalyzerBridge();

    try {
        // Compare two archives
        console.log("Comparing two archives...");
        const result = await analyzer.compare(
            "submissions/student1.zip",
            "submissions/student2.zip",
            {
                output: "reports/comparison.json",
                format: "json",
                threshold: 0.8,
            },
        );

        console.log(
            `Similarity: ${(result.global_similarity * 100).toFixed(1)}%`,
        );
        if (result.is_suspicious) {
            console.log("WARNING: High similarity detected!");
        }

        // Batch analyze a directory
        console.log("\nAnalyzing all submissions...");
        await analyzer.batchAnalyze("submissions", {
            threshold: 0.7,
        });
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        console.error("Error:", errorMessage);
    }
}

// Run the example
if (require.main === module) {
    void runExample();
}

export default ArchiveAnalyzerBridge;
