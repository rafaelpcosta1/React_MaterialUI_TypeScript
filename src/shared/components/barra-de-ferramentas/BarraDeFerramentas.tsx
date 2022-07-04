import { Box, Button, Icon, Paper, TextField, useTheme } from '@mui/material';

interface IBarraDeFerramentasProps {
  textoDaBusca?: string;
  mostrarInputBusca?: boolean;
  aoMudarTextoDaBusca?: (novoText: string) => void;

  textoBotaoNovo?: string;
  mostrarBotaoNovo?: boolean;
  aoClicarEmNovo?: () => void;
}

export const BarraDeFerramentas: React.FC<IBarraDeFerramentasProps> = ({
  textoDaBusca = '',
  mostrarInputBusca = false,
  aoMudarTextoDaBusca,

  textoBotaoNovo = 'Novo',
  mostrarBotaoNovo = true,
  aoClicarEmNovo,
}) => {
  const theme = useTheme();
  return (
    <Box
      gap={1}
      marginX={1}
      padding={1}
      paddingX={2}
      display='flex'
      alignItems='center'
      height={theme.spacing(5)}
      component={Paper}
    >
      {mostrarInputBusca && (
        <TextField
          size='small'
          value={textoDaBusca}
          onChange={(e) => aoMudarTextoDaBusca?.(e.target.value)}
          placeholder='Pesquisar...'
        />
      )}

      <Box flex={1} display='flex' justifyContent={'end'}>
        {(mostrarBotaoNovo && <Button
          color='primary'
          disableElevation
          variant='contained'
          onClick={aoClicarEmNovo}
          endIcon={<Icon>add</Icon>}
        >{textoBotaoNovo}</Button>
        )}
      </Box>

    </Box>
  );
};