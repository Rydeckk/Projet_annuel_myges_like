import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DeliverableRulesService } from "@/services/deliverableRulesService/DeliverableRulesService";
import type {
    DeliverableRule,
    UpdateDeliverableRuleRequest,
} from "@/services/deliverableRulesService/DeliverableRulesService";

interface EditRuleFormProps {
    rule: DeliverableRule;
    onSuccess: () => void;
    onCancel: () => void;
}

export const EditRuleForm = ({
    rule,
    onSuccess,
    onCancel,
}: EditRuleFormProps) => {
    const [loading, setLoading] = useState(false);

    // Rule-specific form data
    const [maxSize, setMaxSize] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");
    const [contentMatch, setContentMatch] = useState<string>("");
    const [matchType, setMatchType] = useState<"TEXT" | "REGEX">("TEXT");
    const [folderStructure, setFolderStructure] = useState<string>("");

    const rulesService = new DeliverableRulesService();

    useEffect(() => {
        // Initialize form data based on rule type
        switch (rule.ruleType) {
            case "MAX_SIZE_FILE":
                if (rule.ruleMaxSizeFile) {
                    setMaxSize(
                        String(rule.ruleMaxSizeFile.maxSize / 1024 / 1024),
                    ); // Convert bytes to MB
                }
                break;
            case "FILE_PRESENCE":
                if (rule.ruleFilePresence) {
                    setFileName(rule.ruleFilePresence.fileName);
                }
                break;
            case "FILE_CONTENT_MATCH":
                if (rule.ruleFileContentMatch) {
                    setFileName(rule.ruleFileContentMatch.fileName);
                    setContentMatch(rule.ruleFileContentMatch.match);
                    setMatchType(rule.ruleFileContentMatch.matchType);
                }
                break;
            case "FOLDER_STRUCTURE":
                if (rule.ruleFolderStructure) {
                    setFolderStructure(
                        JSON.stringify(
                            rule.ruleFolderStructure.expectedStructure,
                            null,
                            2,
                        ),
                    );
                }
                break;
        }
    }, [rule]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        try {
            let ruleData: Record<string, unknown> = {};

            switch (rule.ruleType) {
                case "MAX_SIZE_FILE":
                    ruleData = {
                        maxSize: parseInt(maxSize) * 1024 * 1024, // Convert MB to bytes
                    };
                    break;
                case "FILE_PRESENCE":
                    ruleData = {
                        fileName,
                    };
                    break;
                case "FILE_CONTENT_MATCH":
                    ruleData = {
                        fileName,
                        match: contentMatch,
                        matchType,
                    };
                    break;
                case "FOLDER_STRUCTURE":
                    try {
                        ruleData = {
                            expectedStructure: JSON.parse(folderStructure),
                        };
                    } catch {
                        alert("Invalid JSON format for folder structure");
                        return;
                    }
                    break;
            }

            const request: UpdateDeliverableRuleRequest = {
                ruleData,
            };

            await rulesService.update(rule.id, request);
            onSuccess();
        } catch (error) {
            console.error("Error updating rule:", error);
            alert("Error updating rule. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderRuleSpecificFields = () => {
        switch (rule.ruleType) {
            case "MAX_SIZE_FILE":
                return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="maxSize">
                                Maximum File Size (MB)
                            </Label>
                            <Input
                                id="maxSize"
                                type="number"
                                value={maxSize}
                                onChange={(e) => setMaxSize(e.target.value)}
                                placeholder="100"
                                min="1"
                                max="1000"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Maximum allowed file size in megabytes
                            </p>
                        </div>
                    </div>
                );

            case "FILE_PRESENCE":
                return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="fileName">Required File Name</Label>
                            <Input
                                id="fileName"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                placeholder="README.md"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Exact filename that must be present in the
                                submission
                            </p>
                        </div>
                    </div>
                );

            case "FILE_CONTENT_MATCH":
                return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="fileName">File Name to Check</Label>
                            <Input
                                id="fileName"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                placeholder="package.json"
                            />
                        </div>

                        <div>
                            <Label>Match Type</Label>
                            <RadioGroup
                                value={matchType}
                                onValueChange={(value) =>
                                    setMatchType(value as "TEXT" | "REGEX")
                                }
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="TEXT" id="text" />
                                    <Label htmlFor="text">Text Match</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="REGEX" id="regex" />
                                    <Label htmlFor="regex">
                                        Regular Expression
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div>
                            <Label htmlFor="contentMatch">
                                {matchType === "TEXT"
                                    ? "Text to Find"
                                    : "Regular Expression"}
                            </Label>
                            <Input
                                id="contentMatch"
                                value={contentMatch}
                                onChange={(e) =>
                                    setContentMatch(e.target.value)
                                }
                                placeholder={
                                    matchType === "TEXT"
                                        ? "project-name"
                                        : "^[a-zA-Z0-9-]+$"
                                }
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                {matchType === "TEXT"
                                    ? "Text that must be found in the file content"
                                    : "Regular expression pattern to match against file content"}
                            </p>
                        </div>
                    </div>
                );

            case "FOLDER_STRUCTURE":
                return (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="folderStructure">
                                Expected Folder Structure (JSON)
                            </Label>
                            <Textarea
                                id="folderStructure"
                                value={folderStructure}
                                onChange={(e) =>
                                    setFolderStructure(e.target.value)
                                }
                                rows={10}
                                className="font-mono text-sm"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                JSON structure defining the expected folder
                                hierarchy
                            </p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">
                                    JSON Structure Example
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                                    {`{
  "type": "folder",
  "name": "root",
  "required": true,
  "children": [
    {
      "type": "folder",
      "name": "src",
      "required": true,
      "children": [
        {
          "type": "file",
          "name": "index.js",
          "required": true
        }
      ]
    }
  ]
}`}
                                </pre>
                            </CardContent>
                        </Card>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <Label>Rule Type</Label>
                <div className="mt-2 p-3 bg-muted rounded-md">
                    <p className="font-medium">
                        {rule.ruleType.replace(/_/g, " ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Rule type cannot be changed
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        {rule.ruleType.replace(/_/g, " ")} Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent>{renderRuleSpecificFields()}</CardContent>
            </Card>

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Rule"}
                </Button>
            </div>
        </form>
    );
};
