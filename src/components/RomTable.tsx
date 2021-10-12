import { IRom } from '../interfaces/rom.interface';
import { Link, Paper, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { formatFileSize } from '../tools/file';

const StyledPaper = styled(Paper)`
  background-color: #24282c;
`

export const RomTable = ({ roms }: { roms: IRom[] }) => {
  return (
    <TableContainer component={StyledPaper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Fichier</TableCell>
            <TableCell align="right">Poids</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roms.map((rom) => (
            <TableRow key={rom.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, ' &:hover': { backgroundColor: '#1d1e1f'} }}>
              <TableCell component="th" scope="row">
                <Link underline="none" href={`${process.env.REACT_APP_API_URL}${rom.archive.url}`}>
                  {rom.archive.name}
                </Link>
              </TableCell>
              <TableCell align="right">{formatFileSize(rom.archive.size)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
