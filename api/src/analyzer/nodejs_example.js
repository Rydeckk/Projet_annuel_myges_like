const { spawn } = require('child_process');
const path = require('path');

class ArchiveAnalyzerBridge {
    constructor(pythonPath = 'python', scriptPath = 'nodejs_bridge.py') {
        this.pythonPath = pythonPath;
        this.scriptPath = scriptPath;
    }

    async compare(archive1, archive2, options = {}) {
        const args = [
            this.scriptPath,
            'compare',
            '--archive1', archive1,
            '--archive2', archive2
        ];

        if (options.output) args.push('--output', options.output);
        if (options.format) args.push('--format', options.format);
        if (options.timeout) args.push('--timeout', options.timeout.toString());
        if (options.workers) args.push('--workers', options.workers.toString());
        if (options.threshold) args.push('--threshold', options.threshold.toString());

        return this._executeCommand(args);
    }

    async batchAnalyze(directory, options = {}) {
        const args = [
            this.scriptPath,
            'batch',
            '--directory', directory
        ];

        if (options.threshold) args.push('--threshold', options.threshold.toString());
        if (options.config) args.push('--config', options.config);

        return this._executeCommand(args);
    }

    _executeCommand(args) {
        return new Promise((resolve, reject) => {
            const python = spawn(this.pythonPath, args);
            let output = '';
            let errorOutput = '';

            python.stdout.on('data', (data) => {
                output += data.toString();
            });

            python.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            python.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error(`Python process exited with code ${code}: ${errorOutput}`));
                    return;
                }

                try {
                    const result = JSON.parse(output);
                    if (!result.success) {
                        reject(new Error(result.error || 'Unknown error'));
                    } else {
                        resolve(result);
                    }
                } catch (error) {
                    reject(new Error(`Failed to parse output: ${error.message}\nOutput: ${output}`));
                }
            });

            python.on('error', reject);
        });
    }
}

// Example usage
async function runExample() {
    const analyzer = new ArchiveAnalyzerBridge();

    try {
        // Compare two archives
        console.log('Comparing two archives...');
        const result = await analyzer.compare(
            'submissions/student1.zip',
            'submissions/student2.zip',
            {
                output: 'reports/comparison.json',
                format: 'json',
                threshold: 0.8
            }
        );

        console.log(`Similarity: ${(result.global_similarity * 100).toFixed(1)}%`);
        if (result.is_suspicious) {
            console.log('WARNING: High similarity detected!');
        }

        // Batch analyze a directory
        console.log('\nAnalyzing all submissions...');
        const batchResult = await analyzer.batchAnalyze('submissions', {
            threshold: 0.7
        });

    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Run the example
if (require.main === module) {
    runExample();
}

module.exports = ArchiveAnalyzerBridge;