class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :cas_authenticatable

  validates :email, presence: true

  def name
    email
  end

  def admin?
    admin
  end

  def cas_extra_attributes=(extra_attributes)
    extra_attributes.each do |name, value|
      case name.to_sym
        # when :fullname
        #   self.fullname = value
      when :email
        self.email = value
      end
    end
  end

  rails_admin do
    base do
      field :email
      field :admin do
        visible do
          bindings[:controller].current_user.email != bindings[:object].email
        end
      end
    end
  end

  private

  def validate_not_current_user
    flash[:warming] << "Cannot change own admin status" if email == current_user.email
  end
end
