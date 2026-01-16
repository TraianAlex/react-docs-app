export default function CRUDOverview() {
  return (
    <div className="card">
      <div className="card-header">
        <strong>CRUD Operations Overview</strong>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-3">
            <h6>Create</h6>
            <p className="small text-muted">Add new users with the form above</p>
          </div>
          <div className="col-md-3">
            <h6>Read</h6>
            <p className="small text-muted">View all users in the table</p>
          </div>
          <div className="col-md-3">
            <h6>Update</h6>
            <p className="small text-muted">Edit users or toggle their status</p>
          </div>
          <div className="col-md-3">
            <h6>Delete</h6>
            <p className="small text-muted">Remove users with confirmation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
