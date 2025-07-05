import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DeliverableRulesService } from "@/services/deliverableRulesService/DeliverableRulesService";
import type { CreateDeliverableRuleRequest } from "@/services/deliverableRulesService/DeliverableRulesService";

interface CreateRuleFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export const CreateRuleForm = ({
    onSuccess,
    onCancel,
}: CreateRuleFormProps) => {
    const [ruleType, setRuleType] = useState<string>("");
    const [loading, setLoading] = useState(false);

    // Rule-specific form data
    const [maxSize, setMaxSize] = useState<string>("100");
    const [fileName, setFileName] = useState<string>("");
    const [contentMatch, setContentMatch] = useState<string>("");
    const [matchType, setMatchType] = useState<"TEXT" | "REGEX">("TEXT");
    const [folderStructure, setFolderStructure] = useState<string>("");

    const rulesService = new DeliverableRulesService();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ruleType) return;

        setLoading(true);
        try {
            let ruleData: Record<string, unknown> = {};

            switch (ruleType) {
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

            const request: CreateDeliverableRuleRequest = {
                ruleType: ruleType as
                    | "MAX_SIZE_FILE"
                    | "FILE_PRESENCE"
                    | "FILE_CONTENT_MATCH"
                    | "FOLDER_STRUCTURE",
                ruleData,
            };

            await rulesService.create(request);
            onSuccess();
        } catch (error) {
            console.error("Error creating rule:", error);
            alert("Error creating rule. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderRuleSpecificFields = () => {
        switch (ruleType) {
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
                                placeholder={JSON.stringify(
                                    {
                                        type: "folder",
                                        name: "root",
                                        required: true,
                                        children: [
                                            {
                                                type: "folder",
                                                name: "src",
                                                required: true,
                                                children: [
                                                    {
                                                        type: "file",
                                                        name: "index.js",
                                                        required: true,
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    null,
                                    2,
                                )}
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
    },
    {
      "type": "file",
      "name": "README.md",
      "required": false
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
                <Label htmlFor="ruleType">Rule Type</Label>
                <Select value={ruleType} onValueChange={setRuleType}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a rule type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="MAX_SIZE_FILE">
                            Maximum File Size
                        </SelectItem>
                        <SelectItem value="FILE_PRESENCE">
                            Required File Presence
                        </SelectItem>
                        <SelectItem value="FILE_CONTENT_MATCH">
                            File Content Match
                        </SelectItem>
                        <SelectItem value="FOLDER_STRUCTURE">
                            Folder Structure
                        </SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                    Choose the type of validation rule to create
                </p>
            </div>

            {ruleType && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            {ruleType.replace(/_/g, " ")} Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent>{renderRuleSpecificFields()}</CardContent>
                </Card>
            )}

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={!ruleType || loading}>
                    {loading ? "Creating..." : "Create Rule"}
                </Button>
            </div>
        </form>
    );
};
