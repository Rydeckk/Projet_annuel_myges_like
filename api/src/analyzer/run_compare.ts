import { spawn, ChildProcess } from "child_process";

const args = [
    "nodejs_bridge.py",
    "compare",
    "--archive1",
    "submissions/ex1.zip",
    "--archive2",
    "submissions/ex2.zip",
    "--output",
    "demo_report.json",
    "--format",
    "json",
    "--timeout",
    "30",
    "--workers",
    "4",
    "--threshold",
    "0.8",
];

const process: ChildProcess = spawn("python", args);

let output = "";
let error = "";

process.stdout?.on("data", (data: Buffer) => {
    output += data.toString();
});

process.stderr?.on("data", (data: Buffer) => {
    error += data.toString();
});

process.on("close", (code) => {
    if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        console.error(error);
        return;
    }

    console.log("✅ Analyse terminée");
    try {
        const json = JSON.parse(output) as unknown;
        console.log("📄 Résultat :", JSON.stringify(json, null, 2));
    } catch (err) {
        const errorMessage =
            err instanceof Error ? err.message : "Unknown error";
        console.error("Échec du parse JSON :", errorMessage);
        console.log("Sortie brute :\n", output);
    }
});
