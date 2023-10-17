import {
  Tooltip as MuiTooltip,
  TooltipProps,
  styled,
  tooltipClasses,
} from '@mui/material';
import { ReactComponent as InfoIcon } from '../assets/Information-circle.svg';

interface CustomTooltipProps extends Omit<TooltipProps, 'children'> {
  width: string;
}

const Tooltip = styled(({ width, className, ...props }: CustomTooltipProps) => (
  <MuiTooltip
    placement="right-end"
    {...props}
    classes={{ popper: className }}
  >
    <InfoIcon style={{ marginLeft: '4px' }} />
  </MuiTooltip>
))((props: CustomTooltipProps) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    width: props.width,
  },
}));

// const CustomTooptip = (props: TooltipPropsWithoutChildren) => (
//   <TooltipWithWidth {...props}>
//     <InfoIcon style={{ marginLeft: '4px' }} />
//   </TooltipWithWidth>
// );

export default Tooltip;
