import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from "class-validator";
import { startOfDay, isBefore, isEqual } from "date-fns";

@ValidatorConstraint({ name: "NotInPast", async: false })
export class NotInPastConstraint implements ValidatorConstraintInterface {
    validate(date: Date) {
        return !isBefore(date, startOfDay(new Date()));
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} cannot be in the past`;
    }
}

@ValidatorConstraint({ name: "EndDateAfterStartDate", async: false })
export class EndDateAfterStartDateConstraint
    implements ValidatorConstraintInterface
{
    validate(endDate: Date, args: ValidationArguments) {
        const { object } = args as {
            object: { startDate: Date; endDate: Date };
        };
        return !isBefore(endDate, object.startDate);
    }

    defaultMessage() {
        return "End date must be after start date";
    }
}

@ValidatorConstraint({ name: "DatesNotEqual", async: false })
export class DatesNotEqualConstraint implements ValidatorConstraintInterface {
    validate(_value: Date, args: ValidationArguments) {
        const { object } = args as {
            object: { startDate: Date; endDate: Date };
        };
        return !isEqual(object.startDate, object.endDate);
    }

    defaultMessage() {
        return "Start and end dates cannot be identical";
    }
}
