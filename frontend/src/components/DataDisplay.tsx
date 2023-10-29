import { createClaimsTable } from '../utils/claimUtils';
import { IdTokenClaims } from '@azure/msal-browser';

export const IdTokenData = ({
  idTokenClaims,
}: {
  idTokenClaims: IdTokenClaims;
}) => {
  const tokenClaims = createClaimsTable(idTokenClaims);

  const tableRow = Object.keys(tokenClaims).map((key, index) => {
    return (
      <tr key={key}>
        {tokenClaims[key].map(claimItem => (
          <td key={claimItem}>{claimItem}</td>
        ))}
      </tr>
    );
  });

  return (
    <>
      <div className="data-area-div">
        <p>
          See below the claims in your <strong> ID token </strong>. For more
          information, visit:{' '}
          <span>
            <a href="https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#claims-in-an-id-token">
              docs.microsoft.com
            </a>
          </span>
        </p>
        <div className="data-area-div">
          <table>
            <thead>
              <tr>
                <th>Claim</th>
                <th>Value</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>{tableRow}</tbody>
          </table>
        </div>
      </div>
    </>
  );
};
