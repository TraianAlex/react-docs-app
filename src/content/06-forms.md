# Forms

Controlled components keep form state in React state.

## Controlled Input

```jsx
function LoginForm() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Multiple Inputs

```jsx
function SignupForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

## Checkbox

```jsx
function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, subscribed });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={subscribed}
          onChange={(e) => setSubscribed(e.target.checked)}
        />
        Subscribe to newsletter
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Multiple Checkboxes

```jsx
function InterestsForm() {
  const [interests, setInterests] = useState([]);

  const handleCheckbox = (interest) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <form>
      {['Sports', 'Music', 'Reading', 'Gaming'].map(interest => (
        <label key={interest}>
          <input
            type="checkbox"
            checked={interests.includes(interest)}
            onChange={() => handleCheckbox(interest)}
          />
          {interest}
        </label>
      ))}
      <p>Selected: {interests.join(', ')}</p>
    </form>
  );
}
```

## Radio Buttons

```jsx
function PaymentForm() {
  const [paymentMethod, setPaymentMethod] = useState('card');

  return (
    <form>
      <label>
        <input
          type="radio"
          value="card"
          checked={paymentMethod === 'card'}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Credit Card
      </label>
      <label>
        <input
          type="radio"
          value="paypal"
          checked={paymentMethod === 'paypal'}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        PayPal
      </label>
      <label>
        <input
          type="radio"
          value="crypto"
          checked={paymentMethod === 'crypto'}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Cryptocurrency
      </label>
    </form>
  );
}
```

## Select Dropdown

```jsx
function CountrySelector() {
  const [country, setCountry] = useState('');

  return (
    <select value={country} onChange={(e) => setCountry(e.target.value)}>
      <option value="">Select a country</option>
      <option value="us">United States</option>
      <option value="uk">United Kingdom</option>
      <option value="ca">Canada</option>
      <option value="au">Australia</option>
    </select>
  );
}
```

## Textarea

```jsx
function CommentForm() {
  const [comment, setComment] = useState('');

  return (
    <form>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Enter your comment"
        rows={4}
      />
      <p>Characters: {comment.length}</p>
    </form>
  );
}
```

## Form Validation

```jsx
function RegistrationForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      console.log('Form is valid:', formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div>
        <input
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
        />
        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
      </div>

      <button type="submit">Register</button>
    </form>
  );
}
```

## Real-time Validation

```jsx
function UsernameInput() {
  const [username, setUsername] = useState('');
  const [isValid, setIsValid] = useState(true);

  const validateUsername = (value) => {
    const valid = /^[a-zA-Z0-9_]{3,20}$/.test(value);
    setIsValid(valid);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    validateUsername(value);
  };

  return (
    <div>
      <input
        value={username}
        onChange={handleChange}
        style={{ borderColor: isValid ? 'green' : 'red' }}
        placeholder="Username (3-20 characters)"
      />
      {!isValid && username && (
        <p className="error">Username must be 3-20 alphanumeric characters</p>
      )}
    </div>
  );
}
```

## File Input

```jsx
function ImageUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      // Upload formData to server
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" style={{ maxWidth: '200px' }} />}
      <button type="submit" disabled={!file}>Upload</button>
    </form>
  );
}
```

## Form with Loading State

```jsx
function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <div>Thank you! Your message has been sent.</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} required />
      <input name="email" type="email" value={formData.email} onChange={handleChange} required />
      <textarea name="message" value={formData.message} onChange={handleChange} required />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
```

## Custom Form Hook

```jsx
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const reset = () => setValues(initialValues);

  return { values, handleChange, reset };
}

// Usage
function MyForm() {
  const { values, handleChange, reset } = useForm({
    username: '',
    email: '',
    terms: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(values);
    reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" value={values.username} onChange={handleChange} />
      <input name="email" value={values.email} onChange={handleChange} />
      <label>
        <input name="terms" type="checkbox" checked={values.terms} onChange={handleChange} />
        Accept terms
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Best Practices

1. **Use controlled components** for form inputs
2. **Prevent default on submit** with `e.preventDefault()`
3. **Validate on blur or submit** (not on every keystroke)
4. **Show clear error messages** near relevant fields
5. **Disable submit during loading** to prevent double submission
6. **Clear form after successful submit** (when appropriate)
7. **Use name attribute** to simplify multi-input handling
8. **Provide visual feedback** (loading states, success messages)

## Common Patterns

### Grouped Form Fields
```jsx
function AddressForm() {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });

  const handleChange = (e) => {
    setAddress(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <fieldset>
      <legend>Address</legend>
      <input name="street" value={address.street} onChange={handleChange} />
      <input name="city" value={address.city} onChange={handleChange} />
      <input name="state" value={address.state} onChange={handleChange} />
      <input name="zip" value={address.zip} onChange={handleChange} />
    </fieldset>
  );
}
```

## Avoid

- Uncontrolled components (use refs only when necessary)
- Forgetting `e.preventDefault()` on form submit
- Not showing validation errors to users
- Overly aggressive validation (every keystroke)
- Storing derived values in state (calculate on render)
