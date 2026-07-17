export default function CompanyRow({ name, address, email, phone }) {
    return <tr>
        <td>{name}</td>
        <td>{address}</td>
        <td>{email}</td>
        <td>{phone}</td>
        </tr>
}